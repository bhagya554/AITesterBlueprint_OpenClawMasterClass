# K6 Load Test Scripts

**Agent:** Munna ⚡  
**Tool:** k6 (Grafana Labs)  
**Language:** JavaScript  

---

## Structure

```
K6_Load_Test_Scripts/
├── api-load-test.js        # HTTP API load (500-2000 VU)
├── browser-load-test.js    # Browser-based Core Web Vitals (10 VU)
├── spike-test.js           # Sudden traffic burst
├── endurance-test.js       # 4-hour stability test
├── smoke-perf.js           # Quick 1-user baseline
└── README.md               # This file
```

---

## Setup

```bash
# Install k6
# Windows: choco install k6
# macOS: brew install k6
# Linux: sudo gpg -k && sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D78D77B4830785BD7A16 && echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list && sudo apt-get update && sudo apt-get install k6

# Run locally
k6 run api-load-test.js

# Run with env
k6 run -e VWO_BASE_URL=https://staging-app.vwo.com/api/v3 -e VWO_EMAIL=test@vwo.internal -e VWO_PASSWORD=TestPass123! api-load-test.js

# Run in k6 Cloud
k6 cloud api-load-test.js
```

## Run All Tests

```bash
# 1. Baseline (1 user, 5 min)
k6 run --vus 1 --duration 5m smoke-perf.js

# 2. Load test (500 VU, 10 min)
k6 run api-load-test.js

# 3. Spike test (0 → 2000 VU)
k6 run spike-test.js

# 4. Endurance (200 VU, 4 hours)
k6 run endurance-test.js

# 5. Browser Core Web Vitals (10 VU)
k6 run browser-load-test.js
```

## Output

- **Console:** Real-time metrics
- **InfluxDB:** Time-series Grafana dashboards
- **k6 Cloud:** Hosted dashboards with shareable links
- **Prometheus:** Remote write for k8s environments

---

## Key Metrics

| Metric | Target | Measured By |
|---|---|---|
| p95 API latency | < 300ms | `http_req_duration` |
| p99 API latency | < 500ms | `http_req_duration` |
| Error rate | < 0.1% | `http_req_failed` |
| LCP (Web) | < 2.5s | `browser_web_vital_lcp` |
| FID (Web) | < 100ms | `browser_web_vital_fid` |
| CLS (Web) | < 0.1 | `browser_web_vital_cls` |

⚡ *Munna: "Numbers don't lie. The dashboard does."*
