# Benchmark Report — Stress Test Results

**Agent:** Munna ⚡  
**Test Type:** Stress Test (0 → 2000 VU)  
**Date:** 2026-05-06  
**Duration:** 15 minutes  
**Environment:** Staging  

---

## Test Configuration

| Parameter | Value |
|---|---|
| Ramp | 0 → 2000 VU in 5 minutes |
| Sustain | 2000 VU for 5 minutes |
| Spike | Instant burst to 2000 VU |
| Recovery | Ramp down to 0 |

---

## Breaking Point Analysis

| Users | RPS | p95 Latency | Error Rate | Status |
|---|---|---|---|---|
| 100 | 18 | 150ms | 0% | ✅ Healthy |
| 500 | 78 | 380ms | 0.7% | ⚠️ Degraded |
| 1000 | 120 | 850ms | 3.2% | ❌ Struggling |
| 1500 | 135 | 2.1s | 12% | ❌ Failing |
| 2000 | 140 | 5.8s | 35% | 🔥 Broken |

**Breaking Point:** ~1200 concurrent users  
**Degradation Point:** ~500 concurrent users  

---

## Failure Modes

1. **500 errors spike at 1000+ users**
   - DB connection pool exhausted (100 max)
   - Queue depth >50 pending requests

2. **Latency explosion at 1500+ users**
   - GC pressure (Java backend)
   - Thread pool saturation

3. **Rate limiting kicks in**
   - 429 responses at all tiers above 500 users
   - Too aggressive for legitimate load

---

## Recovery Test

After ramping down to 0 users:

| Time After Ramp Down | p95 Latency | Error Rate |
|---|---|---|
| 30s | 3.2s | 15% |
| 1 min | 1.1s | 5% |
| 2 min | 450ms | 0.8% |
| 5 min | 180ms | 0.2% |

**Recovery Time:** ~2-3 minutes to normal  
**Status:** Acceptable but not ideal

---

## Auto-Scaling Validation

| Trigger | Action | Result |
|---|---|---|
| CPU > 70% | Scale +2 pods | ✅ Triggered at 90s |
| Memory > 80% | Scale +1 pod | ✅ Triggered at 120s |
| Scale-up time | ~45s per pod | ⚠️ Too slow for spike |

**Recommendation:** Pre-warm capacity for known campaigns. Auto-scale is reactive, not predictive.

---

## Conclusion

| Metric | Finding |
|---|---|
| Max Supported Users | ~500 (with acceptable degradation) |
| Hard Breaking Point | ~1200 users |
| Recovery Time | 2-3 minutes |
| Auto-Scale Speed | ~45s (too slow for spikes) |

**Verdict:** Staging can handle expected load (500 users). Not ready for viral spikes without pre-scaling.

⚡ *Munna: "Breaking point found: 1200 users. Don't cross it without a helmet."*
