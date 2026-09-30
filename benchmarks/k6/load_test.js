// k6 Distributed Load Testing Script for MobileNetV2 Inference Runtimes
// Tests increasing concurrency stages: 10, 50, 100, 500, 1000

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const latencyP50 = new Trend('custom_latency_p50');
const latencyP95 = new Trend('custom_latency_p95');
const latencyP99 = new Trend('custom_latency_p99');
const errorRate = new Rate('custom_error_rate');
const requestCounter = new Counter('custom_requests_total');

// Configurable target concurrency via CLI or environment
const TARGET_VUS = parseInt(__ENV.CONCURRENCY || '10');
const DURATION = __ENV.DURATION || '30s';
const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8000';

export const options = {
  scenarios: {
    constant_concurrency: {
      executor: 'constant-vus',
      vus: TARGET_VUS,
      duration: DURATION,
      gracefulStop: '5s',
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<2500'], // Faculty threshold: 95% under 2.5s
    'custom_error_rate': ['rate<0.02'],  // Error rate under 2%
  },
};

// Synthetic 224x224 multipart payload simulation
const dummyPayload = open('./sample_224.bin', 'b') || 'SYNTHETIC_IMAGE_BYTES_PLACEHOLDER';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryBenchmark',
    },
    timeout: '10s',
  };

  const body = 
    '------WebKitFormBoundaryBenchmark\r\n' +
    'Content-Disposition: form-data; name="file"; filename="test.jpg"\r\n' +
    'Content-Type: image/jpeg\r\n\r\n' +
    dummyPayload + '\r\n' +
    '------WebKitFormBoundaryBenchmark--\r\n';

  const res = http.post(`${BASE_URL}/predict`, body, params);

  const isOk = check(res, {
    'status is 200': (r) => r.status === 200,
    'has prediction': (r) => r.body && r.body.includes('class_id'),
  });

  if (!isOk) {
    errorRate.add(1);
  } else {
    errorRate.add(0);
  }

  requestCounter.add(1);
  sleep(0.01); // Minimal pacing
}
