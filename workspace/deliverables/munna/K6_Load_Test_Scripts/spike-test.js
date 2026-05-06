import http from 'k6/http';
import { check, sleep } from 'k6';

// SPIKE TEST: Sudden burst from 0 to 2000 VU instantly
export const options = {
  stages: [
    { duration: '10s', target: 2000 },  // Instant spike
    { duration: '3m', target: 2000 }, // Sustain
    { duration: '1m', target: 0 },     // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Relaxed during spike
    http_req_failed: ['rate<0.05'],    // 5% acceptable during spike
  },
};

const BASE_URL = __ENV.VWO_BASE_URL || 'https://app.vwo.com/api/v3';

export default function () {
  // Simulate viral campaign: many users hitting login + campaigns
  const res = http.batch([
    ['GET', `${BASE_URL}/health`],
    ['GET', `${BASE_URL}/campaigns?page=1&limit=10`],
  ]);

  check(res[0], {
    'health survives spike': (r) => r.status === 200,
  });

  check(res[1], {
    'campaigns survive spike': (r) => r.status === 200 || r.status === 429 || r.status === 503,
  });

  sleep(Math.random() * 2);
}
