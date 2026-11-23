# MethodLock verification

## Verified results

The checked snapshot at **2026-11-23 13:39:58 UTC** (19:09:58 Asia/Colombo) contains two locked protocols, six submitted runs, and 23 checked transactions. Nineteen transactions have approved consensus and successful execution. Four negative cases are retained and verified as failures.

| Run | Scenario | Finalized outcome |
| --- | --- | --- |
| 1 | Complete documented methodology and measurement/config excerpt | `COMPARABLE` |
| 2 | Preprocessing and postprocessing excluded from latency | `PROTOCOL_DEVIATION` |
| 3 | 500 samples instead of the required 1,000 | `PROTOCOL_DEVIATION` |
| 5 | No attached execution evidence | `INSUFFICIENT_EVIDENCE` |
| 6 | Explicit methodology with unsupported certification replacing execution records | `INSUFFICIENT_EVIDENCE` |

Run 4 is an additional ambiguous certification packet. Its assessment and one retry did not gain validator approval. It remains `SUBMITTED` and ranking-ineligible. Its attempted finalization reverted. Run 6 is a separate commitment with explicit methodology; no earlier report was edited and no rejected proposal was promoted to a verdict.

All demonstration data is synthetic. These outcomes establish document-based reported compliance, not that an actual model benchmark ran.

## Deployment and source integrity

- Website: https://methodlock.wirymink515.chatgpt.site
- Network: **Studionet, chain ID 61999**.
- Contract: [`0x18E0C5FDbb02427416033BB79D0Be521852d4C6E`](https://explorer-studio.genlayer.com/address/0x18E0C5FDbb02427416033BB79D0Be521852d4C6E).
- Deployment: [`0x556934f2d87c6d14af5e530b9cbd172bf0b018d5ed97ae0a58f7cd9fff4f98b5`](https://explorer-studio.genlayer.com/transactions/0x556934f2d87c6d14af5e530b9cbd172bf0b018d5ed97ae0a58f7cd9fff4f98b5).
- Deployer: `0xd410A16A05022918E5F8FBC0f4aCBA41AD86F00C` (Studio built-in test account).
- Published application source: `9743a5ae94665dd35a3f84563d861c42e13678e5` in the hosting source repository, version 2. The GitHub repository also includes the final documentation and evidence collected after publication.

The contract was deployed **once**, in Studio Normal (Full Consensus) mode. No leader-only deployment, debug code replacement, shared signer, or MetaMask integration was used. The verification script fetched deployed code and matched it byte-for-byte to `contracts/methodlock.py`. Website reads explicitly use the SDK's `TransactionHashVariant.LATEST_FINAL` option.

## Automated checks

**43 tests passed:** 25 official `genlayer-test` direct-mode contract tests and 18 Node SDK/lifecycle/ranking/security tests. Captured output: [`automated-tests.txt`](../evidence/automated-tests.txt).

Coverage includes commitments and state transitions; five reference outcomes; invalid numeric values and booleans; missing disclosures; forged citations; duplicate evidence; unknown protocols; page bounds; premature/repeated finalization and assessment; independent validator disagreement; varying explanation wording; finalized SDK reads; session signer disconnect; pending-to-final tracking; RPC recovery; execution rollback; rejected consensus despite leader `SUCCESS`; ranking eligibility; protocol discovery before its first run; and escaped untrusted HTML.

The production Vite build passed. The dependency audit reported **0 vulnerabilities** after updating Vite to 6.4.6. Direct tests mock LLM responses; they are not evidence of live consensus. Live results above are checked separately.

## Verified negative cases

| Case | Transaction | Observed behavior |
| --- | --- | --- |
| Invalid empty methodology report | `0xae70c17490ba1e2b6180d151114305ae516a942815b1ae598075a9e4f4b535ac` | Execution rollback: `Methodology report required`; no run added |
| Validator-rejected proposal | `0x9a0a9d61ff067b7cbf1c49fb81728b7f205c111cdd0b7d39a225c8d51cda41e5` | Finalized consensus result 7 despite leader execution `SUCCESS`; no assessment applied |
| Rejected assessment retry | `0x608d2782b969cd807f45c9e9b29c6051b7548a9ce07329af8aabf80bc913c614` | No approved assessment applied |
| Finalization without approved assessment | `0xc5d9ae8a3674fbcca4be60b7e2df4fcd9c6d151298a20cd7a8db6d9ce16f9e59` | Execution rollback: `Assessment required before finalization` |

Finalization alone is insufficient for success. The frontend verifies consensus approval and successful execution independently. The verifier exits unsuccessfully if a receipt is not terminal or differs from its recorded expected success/failure.

## Public browser checks

Verified in Chromium on the public deployment:

- Public access and finalized on-chain records render.
- Session test account creation and faucet funding work; refresh/disconnect clears the signer.
- Website protocol locking, submission, assessment, and finalization produce real hashes.
- Refresh during consensus retains the hash; tracking resumes without a signer or resubmission.
- Newly locked protocol #2 appears before a run references it; protocol lookup opens its requirements/hash.
- Studio-origin rejected transactions can be tracked by hash and show failure.
- Rollback reasons, run details, evidence/provenance disclosures, search, status filters, and sample-mode labeling work.
- JSON export downloaded and contained six live records. Saved as [`browser-export.json`](../evidence/browser-export.json).

Desktop screenshots: [`dashboard.jpg`](../evidence/screenshots/dashboard.jpg) and [`transaction-failures.jpg`](../evidence/screenshots/transaction-failures.jpg). Responsive CSS is implemented; native mobile devices and all browser engines are not certified by these checks. The managed local preview was occupied, so browser QA used the public deployment.

## Evidence and reproduction

[`live-verification.json`](../evidence/live-verification.json) includes exact run findings, quotes, protocol records, source digest, receipt summaries, votes, and the UTC check timestamp. [`transactions.json`](../evidence/transactions.json) records known transaction metadata; the verifier also discovers transactions targeting this contract.

```sh
npm ci
python -m pip install -r requirements-dev.txt
npm test
npm run build
node scripts/verify-live.mjs
```

The verifier performs read-only network operations and writes an updated local evidence snapshot. Studionet can reset or become unavailable. Missing historical transactions or source mismatches must be reported as verification failures, rather than hidden by automatic redeployment.
