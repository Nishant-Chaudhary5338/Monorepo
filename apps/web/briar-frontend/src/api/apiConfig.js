// apiConfig.js
const environments = {
  local: 'local',
  engsap: 'engsap',
  dev: 'dev',
  prd: 'prd',
  app: 'app',
  cloud: 'cloud',
  prdCloud: 'prdCloud',
  devCloud: 'devCloud'
};

// Choose the environment you want to use
const selectedEnvironment = environments.prdCloud;

const baseUrls = {
  local: 'http://localhost:3004',
  engsap: 'http://engsap:3002',
  dev: 'http://dev.engsap:3002',
  prd: 'https://172.31.114.220:3002',
  app: 'https://bc-sapwebapp.briarchemicals.com',
  cloud: 'https://briar-backend-bd97431f6e95.herokuapp.com',
  prdCloud: 'https://prod-briar-backend-59680d02da98.herokuapp.com',
  devCloud: 'https://dev-briar-backend-af17113ff9cb.herokuapp.com'
};

export default baseUrls[selectedEnvironment];
