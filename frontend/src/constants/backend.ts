
const BACKEND_BASE = 'http://psp-validation-bbp-ou-nse.ocp.bbp.epfl.ch/api';
// const BACKEND_BASE = 'http://localhost:3000/api';
const jobsEndpoint = `${BACKEND_BASE}/job`;
const circuitEndpoint = `${BACKEND_BASE}/circuits`;

const jobStatus = {
  SUCCESSFUL: 'SUCCESSFUL',
};

const jobExitCode: {[key: string]: string} = {
  0: 'SUCCESSFUL',
  1: 'ERROR',
  127: 'ERROR',
  137: 'ERROR',
};

export default {};

export {
  jobsEndpoint,
  circuitEndpoint,
  jobStatus,
  jobExitCode,
};
