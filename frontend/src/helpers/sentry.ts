
import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';

const sentryDsn = process.env.VUE_APP_SENTRY_DSN;

if (sentryDsn) {
  console.log('has sentry dns');
  Sentry.init({
    Vue,
    dsn: sentryDsn,
    integrations: [
      new BrowserTracing({
        tracingOrigins: [
          'localhost',
          'bbp-mooc-sim-neuro.epfl.ch',
          'bbp-mooc-sim-neuro-dev.epfl.ch',
          /^\//,
        ],
      }),
    ],
    tracesSampleRate: 0.2,
  });
} else {
  console.log('NO sentry dns');
}
