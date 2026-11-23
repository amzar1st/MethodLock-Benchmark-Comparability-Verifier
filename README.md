# MethodLock

**Compare benchmark results only when their methods are comparable.**

MethodLock is a GenLayer Intelligent Contract and public benchmark-review workspace. It prevents a leaderboard from treating model-only timing, reduced datasets, unsupported exceptions, and undocumented runs as equivalent to a locked evaluation protocol.

- Website: https://methodlock.wirymink515.chatgpt.site
- Contract: [`0x18E0C5FDbb02427416033BB79D0Be521852d4C6E`](https://explorer-studio.genlayer.com/address/0x18E0C5FDbb02427416033BB79D0Be521852d4C6E)
- Network: **Studionet, chain ID 61999** (development network; state may reset)
- [Submission notes](docs/SUBMISSION.md) · [Architecture and trust model](docs/ARCHITECTURE.md) · [Verification](docs/VERIFICATION.md)

## What it does

1. An organizer locks dataset identity/version, sample count/tolerance, batch size, a quality threshold, timing boundaries, and evidence requirements.
2. Entrants commit reports, numeric disclosures, and evidence snapshots. SHA-256 commitments bind the protocol and submission contents.
3. Deterministic checks validate required disclosures and numeric thresholds. GenLayer independently evaluates timing scope, quality methodology, and execution evidence.
4. Independent validators compare requirement IDs, statuses, and deviation codes. Evidence quotes must exist in the committed text. Different explanation wording is allowed.
5. Anyone can finalize an assessed record. Only `FINALIZED` + `COMPARABLE` records are ranking eligible within their own protocol.

Outcomes: `COMPARABLE`, `PROTOCOL_DEVIATION`, `INSUFFICIENT_EVIDENCE`. A known deviation takes precedence over an unknown finding. Assessment and result finalization are separate contract operations; blockchain consensus finality is a separate transaction property.

## Try it

Open the website to read **finalized live state** without connecting a wallet. Select a run to inspect findings, source labels, exact quotes, and commitments. “Explore examples” is explicitly illustrative and performs no chain writes.

For direct frontend writes, select **Connect test account → Create session test account → Request test GEN**. The signer exists in memory only. Then lock a protocol, commit a run, assess it, and finalize it. Watch pending, consensus, and final execution in Transactions. Tracking hashes survive refresh; use Resume tracking after interruption rather than resubmitting.

Deployment uses GenLayer Studio’s built-in account. Studio does not provide a cross-origin signing bridge: the website uses a **separate session-only test signer** created by the same GenLayer SDK. Optional import accepts a disposable test key only. No MetaMask, production wallet, shared private key, or server-side signer is required. Disconnect or refresh clears the signer. Pending transaction tracking needs no signer.

You can also load `contracts/methodlock.py` into [Studio](https://studio.genlayer.com), use its built-in account, and invoke the five core methods there. Import the deployed contract by the address above to inspect the existing instance. Do not redeploy merely to try it.

## Develop and test

Requires Node 20+ and Python 3.12+.

```sh
npm ci
python -m pip install -r requirements-dev.txt
npm test
npm run build
npm run dev
```

The Python suite uses the official `genlayer-test` direct runner, pinned to GenVM `v0.2.12` for the contract’s SDK dependency. The test runner downloads and caches official GenVM artifacts on first run. `pytest.ini` disables the integration plugin’s automatic local RPC setup; the direct plugin remains enabled. LLM outputs are mocked in unit tests; they do not prove network consensus. Network evidence is recorded separately.

`npm test` runs 11 frontend lifecycle/ranking/security tests and 25 direct contract tests. `node scripts/verify-live.mjs` reads current deployed source/state and known receipts without sending transactions. `public/fixtures.json` contains the five synthetic cases; these are not measurements of real model performance.

## Repository

| Path | Purpose |
| --- | --- |
| `contracts/methodlock.py` | Complete Intelligent Contract, custom independent consensus, deterministic checks |
| `src/chain.js` | Official SDK reads/writes, session test account, Studio test faucet |
| `src/lifecycle.js` | Explicit consensus and execution status handling, resumable tracking, eligibility |
| `src/main.js`, `src/style.css` | Responsive frontend, protocol/run inspection, forms, evidence export |
| `public/deployment.json` | Exact network, address, deployer, deployment transaction |
| `public/fixtures.json` | Five reproducible synthetic benchmark submissions |
| `tests/` | Contract and frontend automated tests |
| `evidence/` | Deployment receipt and live verification artifacts |
| `docs/` | Architecture, reproducibility, limitations, submission text |

## Scope and limitations

This is a working development-network MVP, not a production benchmark certification authority. Committed snapshots prevent later edits, but entrants can fabricate documents. Neither a source label nor consensus authenticates a log or proves a run occurred. Actual execution proof needs runner attestations, signed artifacts, dataset digests, and independent replay. No real-world facts are inferred from live websites; the organizer’s locked protocol is authoritative for this comparison, and evidence is the exact text committed on chain.

The semantic model can still be wrong or disagree. Unsupported evidence remains unknown; failed consensus never becomes a comparable record. There is no privileged override, mutable protocol, resubmission-in-place, payout, automatic external fetch, or proof of hardware identity. Data is public; submit no secrets. Current assessments are immutable after success; corrections require a new run. See the architecture document for the adoption path and bounded-storage assumptions.

## Official references

- [GenLayer Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio)
- [Equivalence principle and independent validators](https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle)
- [Testing Intelligent Contracts](https://docs.genlayer.com/developers/intelligent-contracts/testing)
- [GenLayerJS API](https://docs.genlayer.com/api-references/genlayer-js)

The application targets stable Studionet with `genlayer-js@1.1.8`. It deliberately does not mix Studio-dev’s v0.6 preview fee API or chain ID with the stable deployment.

MIT licensed. See [LICENSE](LICENSE).
