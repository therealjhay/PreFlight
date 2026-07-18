# Frontend Audit

**Date:** 2026-07-17
**Auditor:** Lead Frontend Engineer
**Scope:** `apps/dashboard/`, `apps/extension/src/popup/`, `packages/sdk/`

---

## 1. Current Component Tree

```
App (397 lines — monolithic)
├── Header (inline)
│   ├── Brand logo + name
│   └── API status dot
├── Tab navigation (inline)
│   ├── Analyzer tab
│   └── Reputation tab
├── Analyze mode
│   ├── Left Panel
│   │   └── TransactionForm (inline)
│   │       ├── Contract input
│   │       ├── Calldata textarea
│   │       └── Analyze button
│   ├── Demo buttons (inline)
│   └── Right Panel (3 states inline)
│       ├── EmptyState
│       ├── LoadingState
│       └── AnalysisResult
│           ├── RiskScore
│           ├── RiskBadge
│           ├── RiskGauge bar
│           ├── DecodedAction card
│           ├── ContractReputation card
│           ├── SimulationResult card
│           └── WarningList
└── Reputation mode
    ├── Address input
    └── Result card
```

**File count:** 1 component, 1 CSS file — entire app in `App.tsx`

---

## 2. UI Strengths

| Area | Strength |
|---|---|
| Color system | Red/amber/green risk levels are clear and consistent |
| Typography | Inter + JetBrains Mono is professional |
| API integration | Works directly with @preflight/sdk, real analysis |
| Demo buttons | "DEMO APPROVE" / "DEMO TRANSFER" let users see results instantly |
| Risk gauge | Color-coded progress bar communicates severity visually |
| Layout grid | 5-column grid (2 left / 3 right) is good information hierarchy |
| Dark theme | Appropriate for security product |
| Recommendation text | Direct, actionable callout |

---

## 3. UI Weaknesses

| Area | Weakness | Severity |
|---|---|---|
| Architecture | Entire app is one monolithic component (397 lines) | High |
| State management | All state in App — no separation of concerns | High |
| Reusability | Zero reusable components — everything inlined | High |
| Empty state | Generic play icon, "ENTER A TRANSACTION" text is weak | High |
| Loading state | Single spinning circle, no progress indication | High |
| Analysis result | Risk, decoded, reputation, simulation all flat — no hierarchy | Medium |
| Scanline overlay | Gimmicky, adds visual noise, not professional | Medium |
| Glass effect | `backdrop-filter: blur(20px)` is GPU-heavy, unnecessary | Low |
| Demo data | Only 2 demos (approve/transfer), no "malicious" demo | Medium |
| Tabbed layout | "Analyzer" vs "Reputation" as tabs is unnecessary fragmentation | Medium |
| Extension popup | Doesn't match dashboard design — separate visual language | Low |
| Focus states | No visible :focus-visible styles | Medium |
| CSS architecture | Mix of Tailwind and global CSS classes | Low |
| Accessibility | Missing ARIA labels on buttons and inputs | Medium |
| Animations | Only spin and slideUp — loading state is uninformative | Medium |
| Error state | Generic error display, no recovery suggestion | Low |

---

## 4. Proposed Improvements

### Architecture (Phase 2)

Create a proper component hierarchy:

```
components/
  Layout/
    Header.tsx
    PageShell.tsx
  Analysis/
    RiskBadge.tsx
    RiskScore.tsx
    RiskGauge.tsx
    TransactionSummary.tsx
    WarningList.tsx
    RecommendationCard.tsx
    SimulationResult.tsx
    ReputationCard.tsx
  Input/
    TransactionForm.tsx
    DemoButtons.tsx
  Status/
    EmptyState.tsx
    LoadingState.tsx
    ErrorState.tsx
  common/
    Badge.tsx
    Card.tsx
    StatusDot.tsx
    AddressInput.tsx
```

### Analysis Panel — Three Distinct States (Phase 4)

**State 1 — Waiting (empty)**
- Large shield/checklist icon
- Headline: "Ready for Analysis"
- Subtitle: "Paste a transaction or try a demo scenario"
- Demo buttons visible here too

**State 2 — Loading**
- Animated scanning line
- Headline: "Analyzing Transaction"
- Staggered checklist:
  - ✓ Decoding calldata
  - ✓ Simulating execution
  - ✓ Checking reputation
  - ✓ Calculating risk score
- Each item lights up sequentially

**State 3 — Result**
- Risk badge (SAFE / CAUTION / HIGH RISK)
- Large score number
- Risk gauge bar
- Sections:
  - Transaction Summary (action, contract, assets, permissions)
  - Detected Risks (warning list with severity icons)
  - Recommendation (large highlighted card)
- Reputation data shown inline within transaction summary

### Remove or Refactor (Phase 3)

**Remove:**
- Scanline overlay (distracting)
- `glass` CSS class (use Tailwind bg-white/5 border-white/10 instead)
- `glow-green`, `glow-red`, `glow-amber` CSS (use ring utilities)
- Separate "Reputation" tab — integrate into analysis result

**Keep:**
- Dark theme bg-[#0a0a0f]
- Inter + JetBrains Mono fonts
- Color system (emerald-400 safe, amber-400 caution, red-400 danger)
- Grid layout (2/5 left, 3/5 right)
- API integration via @preflight/sdk
- Demo buttons concept

### Design Refinements (Phase 5-8)

- Remove backdrop-filter glass effect (performance)
- Use subtle border-based cards instead
- Add proper focus-visible ring styles
- Add ARIA labels to all interactive elements
- Skeleton loading instead of spinner
- Keyboard navigation for all controls
- Extension popup dashboard-consistent theme

---

## 5. Components to Reuse

| Component | Location | Action |
|---|---|---|
| Risk score card logic | App.tsx:205-231 | Extract to RiskBadge + RiskScore + RiskGauge |
| Decoded action card | App.tsx:234-249 | Extract to TransactionSummary |
| Contract reputation card | App.tsx:251-267 | Extract to ReputationCard |
| Simulation result card | App.tsx:269-288 | Extract to SimulationResult |
| Warning list | App.tsx:290-308 | Extract to WarningList |
| Demo buttons | App.tsx:133-138 | Extract to DemoButtons |
| Transaction input form | App.tsx:142-163 | Extract to TransactionForm |

---

## 6. Components to Remove

| Component | Reason |
|---|---|
| Scanline overlay | Gimmicky, not professional |
| glass CSS class | Replace with Tailwind utilities |
| glow-* CSS classes | Replace with ring/outline utilities |
| Tab navigation (analyzer vs reputation) | Reputation becomes inline section |
| Reputation lookup page | Replaced by inline reputation in analysis result |

---

## 7. Component Dependencies

```
App
├── Header — needs: { }
├── TransactionForm — needs: { onSubmit, loading }
│   └── DemoButtons — needs: { onSelect }
├── EmptyState — needs: { }
├── LoadingState — needs: { }
├── AnalysisResult — needs: { result: AnalysisResponse }
│   ├── RiskBadge — needs: { level, score }
│   ├── RiskGauge — needs: { score }
│   ├── TransactionSummary — needs: { decoded, simulation }
│   ├── ReputationCard — needs: { reputation }
│   ├── WarningList — needs: { reasons[] }
│   └── RecommendationCard — needs: { level, recommendation }
└── ErrorState — needs: { message }
```

---

## 8. Implementation Plan

| Phase | Scope | Files |
|---|---|---|
| 1 | Audit document | `docs/frontend-audit.md` |
| 2 | Component structure | Create `components/` directory, extract all reusable pieces |
| 3 | Layout & CSS | Remove scanline/glass/glow, refine spacing and typography |
| 4 | Analysis panel | Build 3-state panel (empty, loading, result) with checklist animation |
| 5 | Input panel | Improve TransactionForm, add malicious demo, full-width CTA |
| 6 | Responsiveness | Desktop-first, tablet support, mobile compatibility |
| 7 | Animations | Staggered loading checklist, fade transitions, minimal motion |
| 8 | Polish | Focus states, ARIA labels, extension theme sync, final review |
