
const BACKEND_BASE = 'http://psp-validation-bbp-ou-nse.ocp.bbp.epfl.ch/api';
// const BACKEND_BASE = 'http://localhost:3000/api';
const jobsEndpoint = `${BACKEND_BASE}/job`;
const circuitEndpoint = `${BACKEND_BASE}/circuits`;

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

export default {};

export {
  jobsEndpoint,
  circuitEndpoint,
  jobStatus,
  jobExitCode,
};
