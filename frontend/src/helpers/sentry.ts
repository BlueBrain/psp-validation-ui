
import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';

const sentryDsn = process.env.VUE_APP_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    Vue,
    dsn: sentryDsn,
    integrations: [
      new BrowserTracing({
        tracingOrigins: [
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
