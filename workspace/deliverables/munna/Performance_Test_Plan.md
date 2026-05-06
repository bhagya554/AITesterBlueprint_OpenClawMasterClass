# Performance Test Plan — app.vwo.com

**Agent:** Munna ⚡  
**Scope:** Load, stress, spike, endurance testing for web app + API

---

## 1. Objectives

- Validate response times under expected load (1000 concurrent users)
- Identify saturation points and breaking thresholds
- Measure p95/p99 latencies for critical paths
- Validate auto-scaling triggers and recovery times
- Establish baseline benchmarks for regression detection

---

## 2. Test Types

| Type | Load | Duration | Purpose |
|---|---|---|---|
| Baseline | 1 user | 5 min | Single-user performance benchmark |
| Load | 500 VU | 10 min | Expected peak traffic simulation |
| Stress | 500 → 2000 VU | 15 min | Find breaking point |
| Spike | 0 → 2000 VU instantly | 5 min | Sudden traffic surge (viral campaign) |
| Endurance | 200 VU | 4 hours | Memory leaks, connection pool exhaustion |
| Soak | 100 VU | 24 hours | Long-term stability |

---

## 3. Critical Paths to Test

### Web (Playwright-based K6 browser tests)
1. **Login → Dashboard** — Full auth flow + DOM ready
2. **Dashboard → Campaign Editor** — Heavy JS / iframe load
3. **Report Generation** — Data-heavy charts and tables
4. **Campaign List Pagination** — Infinite scroll performance

### API (K6 HTTP tests)
1. `GET /health` — Simplest endpoint, baseline
2. `POST /auth/login` — Auth bottleneck
3. `GET /campaigns` — Pagination, filtering
4. `GET /campaigns/{id}/reports` — Data aggregation
5. `POST /campaigns` — Write operation, DB impact

---

## 4. Success Criteria (SLIs/SLOs)

| Metric | SLO | Warning | Critical |
|---|---|---|---|
| p95 Latency (API) | < 300ms | 300-500ms | > 500ms |
| p99 Latency (API) | < 500ms | 500-1000ms | > 1000ms |
| p95 Latency (Web) | < 2s | 2-4s | > 4s |
| Error Rate | < 0.1% | 0.1-1% | > 1% |
| Throughput | > 100 RPS | 50-100 RPS | < 50 RPS |
| CPU Utilization | < 70% | 70-85% | > 85% |
| Memory Leak | 0 MB/hr | < 50 MB/hr | > 50 MB/hr |

---

## 5. Infrastructure

| Component | Setup |
|---|---|
| Load Generators | K6 Cloud / AWS EC2 (c5.2xlarge × 4) |
| Target | Staging cluster (mirrors prod) |
| Monitoring | Grafana + Prometheus (target metrics) |
| K6 Output | InfluxDB + Grafana dashboards |
| Alerts | PagerDuty on SLO breach |

---

## 6. Automation Stack

| Layer | Technology |
|---|---|
| Load Tool | k6 (Go-based, JS scripts) |
| Browser Load | k6 Browser module (Playwright integration) |
| Legacy | JMeter (for complex business flows) |
| Reporting | k6 Cloud / Grafana dashboards |
| CI | GitHub Actions with k6 action |

---

## 7. Entry & Exit Criteria

**Entry:**
- Staging environment stable (smoke tests green)
- Monitoring dashboards operational
- Baseline test completed (1 user)

**Exit:**
- All SLOs met at expected load (500 VU)
- Stress test identified breaking point (documented)
- No memory leaks in endurance test
- Auto-scaling validated (if applicable)

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Staging ≠ Production | Use production-like data volumes, run read-only prod tests |
| K6 browser tests expensive | Limit to 50 VU browser, supplement with HTTP |
| Third-party widgets skew results | Mock or exclude from measurement |

---

## 9. Sign-Off

⚡ *Munna: "If it slows down, I find where. If it breaks, I find when."*
