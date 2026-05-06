import http from 'k6/http';
import { check } from 'k6';

// SMOKE / BASELINE: 1 user, quick run for CI gating
export const options = {
  vus: 1,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.VWO_BASE_URL || 'https://app.vwo.com/api/v3';

export default function () {
  const res = http.get(`${BASE_URL}/health`);
  
  check(res, {
    'health status 200': (r) => r.status === 200,
    'health fast': (r) => r.timings.duration < 200,
  });
}
