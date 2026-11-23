export const terminalFailures = new Set(['CANCELED','UNDETERMINED','VALIDATORS_TIMEOUT','LEADER_TIMEOUT']);
export function transactionState(tx) {
  const names=['UNINITIALIZED','PENDING','PROPOSING','COMMITTING','REVEALING','ACCEPTED','UNDETERMINED','FINALIZED','CANCELED','APPEAL_REVEALING','APPEAL_COMMITTING','READY_TO_FINALIZE','VALIDATORS_TIMEOUT','LEADER_TIMEOUT'];
  const status=tx.statusName || (typeof tx.status==='number'?names[tx.status]:tx.status) || 'PENDING';
  if(terminalFailures.has(status))return {status,terminal:true,success:false,error:'Consensus ended without a successful finalized result.'};
  if(status!=='FINALIZED')return {status,terminal:false,success:false};
  const consensusResult=tx.last_round?.result ?? tx.lastRound?.result ?? tx.result;
  if(consensusResult!==undefined && consensusResult!==6 && tx.resultName!=='MAJORITY_AGREE')return {status,terminal:true,success:false,error:'Consensus rejected the proposed result; no contract update was applied.'};
  if(consensusResult===undefined && tx.resultName!=='MAJORITY_AGREE')return {status:'FINALIZED · consensus unverified',terminal:false,success:false};
  const receipts=tx.consensus_data?.leader_receipt || [];
  const last=Array.isArray(receipts)?receipts.at(-1):receipts;
  const result=tx.txExecutionResultName || last?.execution_result;
  if(['FINISHED_WITH_RETURN','SUCCESS'].includes(result))return {status,terminal:true,success:true};
  if(['FINISHED_WITH_ERROR','ERROR','FAILURE'].includes(result) || last?.error)return {status,terminal:true,success:false,error:last?.error || (typeof last?.result?.payload==='string'?last.result.payload:'Contract execution reverted.')};
  return {status:'FINALIZED · execution unverified',terminal:false,success:false};
}
export async function trackTransaction({client,hash,onUpdate,attempts=80,interval=3000,pause=ms=>new Promise(r=>setTimeout(r,ms))}) {
  for(let n=0;n<attempts;n++){
    let tx;
    try{tx=await client.getTransaction({hash});}catch(error){onUpdate({status:'RPC unavailable · tracking retained',error:String(error.message||error)});await pause(interval);continue;}
    const state=transactionState(tx);onUpdate({...state,tx});
    if(state.terminal)return state;
    await pause(interval);
  }
  return {status:'Tracking paused · resume available',terminal:false,success:false};
}
export function eligible(run){return run.phase==='FINALIZED' && run.outcome==='COMPARABLE';}
export function rankRuns(runs,protocolId){return runs.filter(r=>r.protocol_id===protocolId && eligible(r)).sort((a,b)=>a.run.disclosures.latency_us-b.run.disclosures.latency_us || Number(a.id)-Number(b.id));}
export function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

export function protocolIds(count,runs=[]){
  if(!count)return [];
  const recent=Array.from({length:Math.min(10,count)},(_,i)=>String(count-i));
  return [...new Set([...recent,'1',...runs.map(r=>r.protocol_id)])].filter(id=>/^[1-9][0-9]*$/.test(id) && Number(id)<=count);
}
