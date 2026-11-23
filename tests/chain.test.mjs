import test from 'node:test';import assert from 'node:assert/strict';
import * as chain from '../src/chain.js';
import {TransactionHashVariant} from 'genlayer-js/types';
test('contract reads explicitly select finalized state with SDK-supported option',async()=>{const original=chain.client.readContract;let params;chain.client.readContract=async p=>{params=p;return '{"runs":5}';};try{assert.deepEqual(await chain.read('0x18E0C5FDbb02427416033BB79D0Be521852d4C6E','get_counts'),{runs:5});assert.equal(params.transactionHashVariant,TransactionHashVariant.LATEST_FINAL);assert.equal(params.stateStatus,undefined);}finally{chain.client.readContract=original;}});
test('session signer can connect and is cleared by disconnect',()=>{const address=chain.connectTestAccount();assert.match(address,/^0x[0-9a-fA-F]{40}$/);assert.ok(chain.account);chain.disconnect();assert.equal(chain.account,null);});
