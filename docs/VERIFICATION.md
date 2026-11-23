# Verification record

## Automated checks

- 25 official GenLayer direct-mode contract tests passed.
- 11 Node tests passed for transaction states, finalized execution failure, interrupted tracking, filtering/ranking, and safe evidence rendering.
- Production Vite build passed.
- Unit tests use mocked LLM outputs. They validate deterministic logic and validator behavior, not live model quality.

## Deployment

The contract was deployed once through GenLayer Studio's built-in account in Normal (Full Consensus) mode. Deployment receipt is stored in `evidence/deployment-receipt.json`. Network: Studionet, chain 61999.

- Address: `0x18E0C5FDbb02427416033BB79D0Be521852d4C6E`
- Deployment: `0x556934f2d87c6d14af5e530b9cbd172bf0b018d5ed97ae0a58f7cd9fff4f98b5`
- Deployer: `0xd410A16A05022918E5F8FBC0f4aCBA41AD86F00C`

Live verification artifacts and browser checks are recorded as completed. No production/testnet guarantee is inferred from unit tests or the website being reachable. The verification script is read-only and can be rerun against current state.
