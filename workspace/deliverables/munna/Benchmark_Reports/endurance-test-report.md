# Benchmark Report — Endurance Test Results

**Agent:** Munna ⚡  
**Test Type:** Endurance (200 VU × 4 hours)  
**Date:** 2026-05-06  
**Environment:** Staging  

---

## Test Configuration

| Parameter | Value |
|---|---|
| Virtual Users | 200 |
| Duration | 4 hours |
| Total Requests | ~1.1 million |
| Think Time | 5-15s random |

---

## Memory Leak Analysis

| Time | Heap Used | Heap Growth | Status |
|---|---|---|---|
| 0 min | 2.1 GB | — | Baseline |
| 30 min | 2.3 GB | +0.2 GB | ✅ Normal |
| 1 hour | 2.5 GB | +0.4 GB | ✅ Normal |
| 2 hours | 2.9 GB | +0.8 GB | ⚠️ Growing |
| 3 hours | 3.4 GB | +1.3 GB | ⚠️ Concerning |
| 4 hours | 3.8 GB | +1.7 GB | ❌ Leak suspected |

**Growth Rate:** ~7 MB/min  
**Projected 24h:** Would exceed 8GB limit  

---

## Connection Pool Health

| Time | Active Connections | Idle | Wait Queue |
|---|---|---|---|
| 0 min | 45 | 35 | 0 |
| 1 hour | 52 | 28 | 0 |
| 2 hours | 61 | 19 | 2 |
| 3 hours | 78 | 5 | 8 |
| 4 hours | 92 | 2 | 15 | 🔥 |

**Observation:** Connection pool not releasing idle connections fast enough.

---

## Error Rate Over Time

| Time | Error Rate | Dominant Error |
|---|---|---|
| 0-1h | 0.02% | None |
| 1-2h | 0.05% | Occasional 500s |
| 2-3h | 0.18% | Connection timeout |
| 3-4h | 0.45% | Connection timeout, 503 |

---

## Latency Degradation

| Time | p50 | p95 | p99 |
|---|---|---|---|
| 0 min | 180ms | 280ms | 350ms |
| 1 hour | 195ms | 310ms | 390ms |
| 2 hours | 220ms | 380ms | 480ms |
| 3 hours | 280ms | 520ms | 720ms |
| 4 hours | 350ms | 720ms | 1.2s | ❌ |

---

## Findings

### Memory Leak
- **Suspected cause:** Campaign cache never expires; grows unbounded
- **Evidence:** Heap dump shows 60% retained by `CampaignCacheManager`
- **Fix:** Implement LRU cache with 1000 entry limit + TTL

### Connection Pool Exhaustion
- **Suspected cause:** Connections not returned on exception paths
- **Evidence:** `close()` missing in 3 DAO methods
- **Fix:** Add try-with-resources / finally blocks

### Gradual Latency Increase
- **Suspected cause:** GC pressure from growing heap
- **Evidence:** Full GC frequency increases from 1/hour to 12/hour
- **Fix:** Fix memory leak first; tune GC if needed

---

## Recommendations

| Priority | Action | Effort |
|---|---|---|
| 🔴 P0 | Fix connection pool leak | 2 days |
| 🔴 P0 | Add cache TTL/LRU | 1 day |
| 🟡 P1 | Add connection pool metrics to dashboards | 4 hours |
| 🟡 P1 | Schedule weekly endurance tests in CI | 2 hours |
| 🟢 P2 | Evaluate switching to HikariCP if not using | 1 day |

---

## Sign-Off

| Check | Status |
|---|---|
| Memory leak identified | ✅ |
| Root cause located | ✅ |
| Fix assigned | ✅ |
| Re-test scheduled | ⏳ Post-fix |

⚡ *Munna: "4 hours of testing found what 10 minutes couldn't. Endurance matters."*
