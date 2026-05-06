# Benchmark Reports

**Agent:** Munna ⚡  
**Reports Generated:** 4  

---

## Available Reports

| Report | File | Purpose | Key Finding |
|---|---|---|---|
| Baseline | `baseline-report.md` | 1-user performance reference | All endpoints within SLO |
| Load Test | `load-test-report.md` | 500 VU expected load | p95 at 380ms (over 300ms SLO) |
| Stress Test | `stress-test-report.md` | 0→2000 VU breaking point | Breaking point at ~1200 users |
| Endurance | `endurance-test-report.md` | 200 VU × 4 hours | Memory leak + connection pool exhaustion |

---

## Summary Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  MUNNA'S PERFORMANCE DASHBOARD — app.vwo.com             │
├─────────────────────────────────────────────────────────────┤
│  🟢 Baseline    │ All green   │ SLO: Met                   │
│  🟡 Load 500    │ Warning     │ SLO: p95 exceeded by 80ms  │
│  🔴 Stress 2k   │ Critical    │ Breaking point: 1200 users │
│  🔴 Endurance   │ Critical    │ Memory leak found          │
├─────────────────────────────────────────────────────────────┤
│  ACTION REQUIRED:                                          │
│  1. Optimize report aggregation query                      │
│  2. Fix connection pool leak in DAO layer                  │
│  3. Add LRU cache TTL for campaign data                    │
│  4. Re-run full suite after fixes                          │
└─────────────────────────────────────────────────────────────┘
```

---

## How to Regenerate

All reports are generated from k6 output. To regenerate:

```bash
# Baseline
k6 run --out influxdb=http://localhost:8086/k6 ../K6_Load_Test_Scripts/smoke-perf.js

# Load
k6 run --out influxdb=http://localhost:8086/k6 ../K6_Load_Test_Scripts/api-load-test.js

# Stress
k6 run --out influxdb=http://localhost:8086/k6 ../K6_Load_Test_Scripts/spike-test.js

# Endurance
k6 run --out influxdb=http://localhost:8086/k6 ../K6_Load_Test_Scripts/endurance-test.js
```

Then query InfluxDB for metrics and update markdown reports.

---

## Grafana Dashboards

Import these queries into Grafana for live monitoring:

```sql
-- p95 Latency
SELECT percentile("value", 95) FROM "http_req_duration" WHERE $timeFilter

-- Error Rate
SELECT sum("value") / count("value") FROM "http_req_failed" WHERE $timeFilter

-- RPS
SELECT count("value") / 60 FROM "http_reqs" WHERE $timeFilter GROUP BY time(1m)
```

⚡ *Munna: "Reports are only useful if someone reads them. Read this one."*
