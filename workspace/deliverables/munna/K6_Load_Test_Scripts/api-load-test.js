import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Custom metrics
const loginLatency = new Trend('login_latency');
const apiErrorRate = new Rate('api_errors');
const campaignFetchLatency = new Trend('campaign_fetch_latency');
const reportLatency = new Trend('report_latency');

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 500 },   // Steady state
    { duration: '2m', target: 1000 },  // Peak
    { duration: '2m', target: 2000 }, // Stress
    { duration: '3m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
    login_latency: ['p(95)<500'],
    campaign_fetch_latency: ['p(95)<200'],
    report_latency: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.VWO_BASE_URL || 'https://app.vwo.com/api/v3';

export function setup() {
  // Authenticate once and return token for all VUs
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: __ENV.VWO_EMAIL,
    password: __ENV.VWO_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } });

  check(loginRes, {
    'setup login status 200': (r) => r.status === 200,
  });

  return { token: loginRes.json('accessToken') };
}

export default function (data) {
  const token = data.token;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  group('Health Check', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, {
      'health status 200': (r) => r.status === 200,
      'health response time < 100ms': (r) => r.timings.duration < 100,
    });
  });

  sleep(1);

  group('Login Simulation', () => {
    const start = Date.now();
    const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      email: __ENV.VWO_EMAIL,
      password: __ENV.VWO_PASSWORD,
    }), { headers: { 'Content-Type': 'application/json' } });
    
    loginLatency.add(Date.now() - start);
    const success = check(res, {
      'login status 200': (r) => r.status === 200,
    });
    apiErrorRate.add(!success);
  });

  sleep(2);

  group('List Campaigns', () => {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/campaigns?page=1&limit=20`, { headers });
    
    campaignFetchLatency.add(Date.now() - start);
    const success = check(res, {
      'campaigns status 200': (r) => r.status === 200,
      'campaigns has data': (r) => r.json('data') !== undefined,
    });
    apiErrorRate.add(!success);
  });

  sleep(2);

  group('Campaign Report', () => {
    const campaignId = __ENV.TEST_CAMPAIGN_ID || 'seed-campaign-123';
    const start = Date.now();
    const res = http.get(
      `${BASE_URL}/campaigns/${campaignId}/reports?startDate=2026-01-01&endDate=2026-05-06`,
      { headers }
    );
    
    reportLatency.add(Date.now() - start);
    const success = check(res, {
      'report status 200': (r) => r.status === 200,
      'report has visitors': (r) => r.json('visitors') !== undefined,
    });
    apiErrorRate.add(!success);
  });

  sleep(Math.random() * 3 + 1); // Think time 1-4s
}

export function teardown(data) {
  console.log(`⚡ Test complete. Final error rate: ${apiErrorRate.value * 100}%`);
}
