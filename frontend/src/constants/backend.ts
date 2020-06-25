
const BACKEND_PORT = '3000';
const BACKEND_BASE = `http://localhost:${BACKEND_PORT}/api`;
const jobsEndpoint = `${BACKEND_BASE}/job`;
const circuitEndpoint = `${BACKEND_BASE}/circuits`;

export default {};

export {
  jobsEndpoint,
  circuitEndpoint,
};
