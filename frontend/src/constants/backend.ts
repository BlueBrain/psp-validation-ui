
const BACKEND_BASE = `${process.env.VUE_APP_BACKEND_URL}/api`;
const JOBS_ENDPOINT = `${BACKEND_BASE}/job`;
const CIRCUIT_ENDPOINT = `${BACKEND_BASE}/circuits`;
const CIRCUIT_INFO_ENDPOINT = `${BACKEND_BASE}/snap`;

const jobStatus = {
  SUCCESSFUL: 'SUCCESSFUL',
  ERROR: 'ERROR',
  FAILED: 'FAILED',
};

const jobExitCode: {[key: string]: string} = {
  0: jobStatus.SUCCESSFUL,
  1: jobStatus.ERROR,
  127: jobStatus.ERROR,
  137: jobStatus.ERROR,
};

const globalMessages: {[key: string]: string} = {
  LOGIN_REQUIRED: 'LOGIN_REQUIRED',
};

export default {};

export {
  JOBS_ENDPOINT,
  CIRCUIT_ENDPOINT,
  CIRCUIT_INFO_ENDPOINT,
  jobStatus,
  jobExitCode,
  globalMessages,
};
