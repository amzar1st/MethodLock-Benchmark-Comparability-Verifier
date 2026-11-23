# Project Explorer submission

**Title:** MethodLock — Benchmark Comparability Verifier

**Category:** Projects (complete frontend plus Intelligent Contract)

**Website:** https://methodlock.wirymink515.chatgpt.site

**Repository:** https://github.com/amzar1st/MethodLock-Benchmark-Comparability-Verifier

**Contract:** https://explorer-studio.genlayer.com/address/0x18E0C5FDbb02427416033BB79D0Be521852d4C6E

**Deployment transaction:** https://explorer-studio.genlayer.com/transactions/0x556934f2d87c6d14af5e530b9cbd172bf0b018d5ed97ae0a58f7cd9fff4f98b5

## Description

Benchmark leaderboards can reward a faster number produced by a different method. MethodLock commits an organizer's evaluation protocol, then checks whether entrant reports and evidence satisfy the same dataset, batch size, quality evaluation, timing boundaries, and disclosure requirements.

Integer checks enforce numeric requirements and tolerances. GenLayer validators independently interpret methodology and execution-evidence excerpts, then compare per-requirement decisions and deviation codes. Exact cited passages must exist in the committed evidence. Only finalized comparable records qualify for ranking within their own protocol.

The public frontend reads finalized contract state, supports protocol locking and immutable run submission, requests methodology assessment, finalizes results, and tracks transactions through consensus and execution. It distinguishes finalized reverts from successful writes, retains transaction hashes for resumable tracking, and exports auditable records. No MetaMask is required.

Deployment uses Studio's built-in account; direct website writes use a separate disposable in-memory test signer because Studio exposes no cross-origin signing bridge. This distinction is visible in the product and documented.

The five synthetic MVP cases cover compliant methodology, excluded preprocessing, a smaller dataset, unsupported certification, and missing execution evidence. Example mode is clearly separate from live chain results. Evidence snapshots demonstrate reported compliance only; actual execution requires authenticated runner artifacts or independent replay.

## Why GenLayer matters

A numeric script cannot establish whether “inference time” covers preprocessing or whether an exception claim is supported. MethodLock uses independent semantic evaluation for those questions, while keeping numeric tolerances and final eligibility deterministic. Validators do not accept leader formatting as proof; they independently derive the same decisions from the committed evidence.

## Validation and limitations

See `docs/VERIFICATION.md` and machine-readable artifacts in `evidence/`. Automated coverage includes 25 contract tests and 18 lifecycle/ranking/rendering tests. The project targets Studionet development infrastructure, which may reset. It does not authenticate self-reported logs, certify real model performance, hold funds, or make payouts.

## Suggested review walkthrough

1. Open Live contract and inspect the active locked protocol.
2. Open each benchmark run to inspect requirement findings and exact evidence citations.
3. Check the contract and verified transaction links against the explorer.
4. Create a session test account, request test GEN, and submit a fixture or your own evidence packet.
5. Track submission, assess the new run, and finalize the result. An incomplete or deviating run stays ineligible.
6. Inspect `contracts/methodlock.py`, the independent validator tests, and the trust-model documentation.

## Continued development

Signed runner manifests, immutable dataset digests, independent replay, challenge evidence, and an indexed global leaderboard would extend this primitive into a practical competition submission gate.

## Verified demonstration and submission assets

Five reference scenarios are finalized: run 1 comparable; runs 2 and 3 protocol deviations; runs 5 and 6 insufficient evidence. Run 4 is an additional ambiguous packet retained as a rejected-consensus demonstration. Its failed assessment and retry left it ineligible; a premature finalization reverted. No prior submission was edited.

The final read-only verification checked 23 transactions (19 successful and four expected negative cases), and matched deployed source byte-for-byte. Website reads explicitly select finalized state. The public browser flow verified creation of a session test account, test-token funding, protocol locking, submission, assessment, finalization, interrupted tracking recovery, rollback reporting, and tracking a Studio-origin consensus rejection.

- Logo for upload: `docs/assets/methodlock-logo.png` (512 × 512 PNG).
- Screenshots: `evidence/screenshots/dashboard.jpg`, `evidence/screenshots/transaction-failures.jpg`.
- Machine-readable evidence and exact transaction links: `evidence/live-verification.json`.
- Browser-exported run records: `evidence/browser-export.json`.
- Full verification and limitations: `docs/VERIFICATION.md`.

Suggested short summary: **MethodLock checks benchmark reports against immutable evaluation protocols using deterministic numeric checks and independent GenLayer methodology review, preventing incomparable results from entering a leaderboard.**

This is a Studionet development-network MVP. The synthetic demonstrations establish reported compliance, not authentic execution or certified model performance. Studio's built-in account deployed the contract; direct website writes use a separate session-only test signer because Studio does not expose a cross-origin signing bridge.
