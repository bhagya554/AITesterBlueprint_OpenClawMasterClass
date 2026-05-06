# Benchmark Report — Load Test Results

**Agent:** Munna ⚡  
**Test Type:** Load Test (500 VU)  
**Date:** 2026-05-06  
**Duration:** 10 minutes  
**Environment:** Staging  

---

## Test Configuration

| Parameter | Value |
|---|---|
| Virtual Users | 500 |
| Ramp Time | 2 minutes |
| Steady State | 5 minutes |
| Ramp Down | 2 minutes |
| Total Requests | ~45,000 |

---

## Results

### Throughput

| Metric | Value |
|---|---|
| Requests/sec (avg) | 75 RPS |
| Requests/sec (peak) | 92 RPS |
| Total Requests | 45,230 |

### Latency Distribution

| Percentile | API Latency | Web Latency |
|---|---|---|
| p50 | 180ms | 1.8s |
| p75 | 240ms | 2.4s |
| p95 | 380ms | 3.2s |
| p99 | 520ms | 4.1s |

### Error Rate

| Category | Count | Rate |
|---|---|---|
| 200 OK | 44,891 | 99.25% |
| 429 Rate Limited | 312 | 0.69% |
| 500 Server Error | 27 | 0.06% |
| **Total Errors** | **339** | **0.75%** |

### Resource Utilization (Target)

| Resource | Peak | SLO | Status |
|---|---|---|---|
| CPU | 65% | <70% | ✅ |
| Memory | 4.2GB | <8GB | ✅ |
| DB Connections | 78/100 | <80% | ✅ |
| Network I/O | 45 Mbps | <100 Mbps | ✅ |

---

## Bottlenecks Identified

1. **Report endpoint (`/campaigns/{id}/reports`)**
   - p95 spikes to 800ms under load
   - Root cause: Unoptimized aggregation query
   - **Action:** Add composite index on `(campaign_id, date)`

2. **Auth endpoint**
   - bcrypt iterations causing CPU spike
   - **Action:** Consider caching login tokens or using faster hash for internal tests

---

## SLO Compliance

| SLO | Target | Actual | Status |
|---|---|---|---|
| p95 API latency | <300ms | 380ms | ⚠️ |
| p99 API latency | <500ms | 520ms | ❌ |
| Error rate | <0.1% | 0.75% | ❌ |
| Throughput | >100 RPS | 75 RPS | ❌ |

---

## Recommendations

1. **Optimize report aggregation query** — highest impact
2. **Add read replicas** for report/reporting queries
3. **Implement Redis cache** for `/campaigns` list
4. **Increase rate limit** for authenticated users (currently too aggressive)

⚡ *Munna: "We hit the wall at 500 users. Need fixes before prod."*
