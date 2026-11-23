// Read-only: source, finalized contract state, and receipt verification.
import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import {createClient} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';
import {TransactionHashVariant} from 'genlayer-js/types';
import {transactionState} from '../src/lifecycle.js';
const cfg=JSON.parse(fs.readFileSync('public/deployment.json'));const client=createClient({chain:studionet});
const rpc=async(method,params)=>{const r=await fetch(cfg.rpc,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});const d=await r.json();if(d.error)throw Error(d.error.message);return d.result;};
const read=async(functionName,args=[])=>JSON.parse(await client.readContract({address:cfg.address,functionName,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL}));
const rawCode=await rpc('gen_getContractCode',[cfg.address]);
const local=fs.readFileSync('contracts/methodlock.py','utf8');
let code=typeof rawCode==='string'?rawCode:rawCode?.code;
if(typeof code!=='string')throw Error('Unsupported contract code response: '+JSON.stringify(rawCode).slice(0,100));
if(code.startsWith('0x'))code=Buffer.from(code.slice(2),'hex').toString();
else if(!code.includes('class MethodLock'))code=Buffer.from(code,'base64').toString();
assert.equal(code,local,'Deployed code differs from source');
const counts=await read('get_counts');const protocols=[];
for(let id=1;id<=Math.min(counts.protocols,20);id++)protocols.push(await read('get_protocol',[String(id)]));
const runs=[];for(let start=1;start<=Math.min(counts.runs,100);start+=20)runs.push(...await read('list_runs',[start,20]));
const known=JSON.parse(fs.readFileSync('evidence/transactions.json'));const expected=new Map(known.map(t=>[t.hash,t]));
const discovered=await rpc('sim_getTransactionsForAddress',[cfg.address]);
const hashes=[...new Set([...known.map(t=>t.hash),...discovered.map(t=>t.hash)])];const receipts=[];
for(let start=0;start<hashes.length;start+=4){
 const batch=await Promise.all(hashes.slice(start,start+4).map(async hash=>{
 const t=await client.getTransaction({hash});const state=transactionState(t);const meta=expected.get(hash)||{};
 const readable=t.data?.calldata?.readable||'';const method=meta.method||readable.match(/"method":\s*"([^\"]+)"/)?.[1]||(t.type===1?'deploy':'unknown');
 return {...meta,hash,method,run_id:meta.run_id||readable.match(/"args":\["([0-9]+)"/)?.[1],expected_success:meta.expected_success??true,terminal:state.terminal,status:state.status,success:state.success,error:state.error||null,from:t.from_address||t.sender,to:t.to_address||t.recipient,execution_mode:t.execution_mode,consensus_result:t.last_round?.result??t.result,round:t.last_round?.round,votes:t.last_round?.validator_votes_name||t.lastRound?.validatorVotesName};
 }));receipts.push(...batch);
}
const evidence={checked_at:new Date().toISOString(),network:cfg,source_sha256:crypto.createHash('sha256').update(local).digest('hex'),source_matches_deployment:true,counts,protocols,runs,receipts};
fs.writeFileSync('evidence/live-verification.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify({source_matches:true,counts,runs:runs.map(r=>({id:r.id,name:r.run.name,phase:r.phase,outcome:r.outcome})),receipts:receipts.map(r=>({method:r.method,hash:r.hash,status:r.status,success:r.success}))},null,2));
if(receipts.some(r=>!r.terminal || r.success !== (r.expected_success ?? true)))process.exitCode=1;
