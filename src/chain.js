import {createAccount,createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionHashVariant} from 'genlayer-js/types';
export let account=null;
export const client=createClient({chain:studionet});
export function connectTestAccount(key){account=key?createAccount(key):createAccount();return account.address;}
export function disconnect(){account=null;}
export async function read(address,functionName,args=[]){const result=await client.readContract({address,functionName,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL});return typeof result==='string'?JSON.parse(result):result;}
export async function write(address,functionName,args){if(!account)throw Error('Connect a session test account first.');return client.writeContract({account,address,functionName,args});}
export async function fund(){if(!account)throw Error('No session account');const response=await fetch(studionet.rpcUrls.default.http[0],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'sim_fundAccount',params:[account.address,1e19]})});const result=await response.json();if(result.error)throw Error(result.error.message);return result.result;}
