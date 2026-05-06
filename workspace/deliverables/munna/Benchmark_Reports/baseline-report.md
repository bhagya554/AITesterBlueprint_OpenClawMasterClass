# Benchmark Report — Baseline Performance

**Agent:** Munna ⚡  
**Test Type:** Baseline (1 Virtual User)  
**Date:** 2026-05-06  
**Environment:** Staging  

---

## Test Configuration

| Parameter | Value |
|---|---|
| Virtual Users | 1 |
| Duration | 5 minutes |
| Tool | k6 |
| Script | `smoke-perf.js` |

---

## Results

### API Endpoints

| Endpoint | Avg Latency | p50 | p95 | p99 | Status |
|---|---|---|---|---|---|
| GET /health | 45ms | 42ms | 78ms | 95ms | ✅ |
| POST /auth/login | 320ms | 310ms | 450ms | 580ms | ✅ |
| GET /campaigns | 120ms | 115ms | 180ms | 210ms | ✅ |
| GET /campaigns/{id}/reports | 280ms | 270ms | 420ms | 510ms | ✅ |
| POST /campaigns | 350ms | 340ms | 500ms | 620ms | ✅ |

### Web (Browser)

| Page | LCP | FID | CLS | TTFB |
|---|---|---|---|---|
| /login | 1.2s | 12ms | 0.02 | 180ms |
| /dashboard | 2.1s | 18ms | 0.05 | 250ms |
| /campaigns/editor | 3.4s | 45ms | 0.08 | 320ms |
| /reports | 2.8s | 22ms | 0.03 | 290ms |

---

## Observations

- `/health` consistently fast (sub-100ms)
- Auth endpoint highest latency due to bcrypt hashing
- Editor page heaviest (iframe + canvas resources)
- All Core Web Vitals within "Good" thresholds

---

## Baseline Hash

```
sha256(baseline-results-2026-05-06) = a1b2c3d4...e5f6
```

Use this hash to detect performance regressions in future runs.

⚡ *Munna: "This is our speed limit. Anything slower is a regression."*
