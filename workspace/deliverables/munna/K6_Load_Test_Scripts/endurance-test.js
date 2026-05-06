import http from 'k6/http';
import { check, sleep } from 'k6';

// ENDURANCE TEST: 200 VU for 4 hours
export const options = {
  stages: [
    { duration: '5m', target: 200 },
    { duration: '4h', target: 200 },
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.001'], // 0.1% max
  },
};

const BASE_URL = __ENV.VWO_BASE_URL || 'https://app.vwo.com/api/v3';

export function setup() {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: __ENV.VWO_EMAIL,
    password: __ENV.VWO_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } });

  return { token: loginRes.json('accessToken') };
}

export default function (data) {
  const headers = { 'Authorization': `Bearer ${data.token}` };

  // Rotate through endpoints to simulate real usage
  const endpoints = [
    { method: 'GET', url: '/health' },
    { method: 'GET', url: '/campaigns?page=1&limit=20' },
    { method: 'GET', url: '/campaigns/seed-id/reports?startDate=2026-01-01&endDate=2026-05-06' },
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.request(endpoint.method, `${BASE_URL}${endpoint.url}`, null, { headers });

  check(res, {
    'endurance request successful': (r) => r.status === 200,
  });

  sleep(5 + Math.random() * 10); // Variable think time
}
