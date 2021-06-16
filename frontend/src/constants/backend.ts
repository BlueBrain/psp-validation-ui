
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
  jobStatus,
  jobExitCode,
  globalMessages,
};
