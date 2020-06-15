
import axios from 'axios';
import Oidc from 'oidc-client';
import configBBP from '@/helpers/bbp-config';

let token = '';

function getActualAuthProvider() {
  return configBBP;
}

function createAuthConfig() {
  const actualAuthProvider = getActualAuthProvider();
  const redirect = `${window.location.origin}${process.env.BASE_URL}`;

  const oidcConfig = {
    /* eslint-disable @typescript-eslint/camelcase */
    authority: actualAuthProvider.auth.authUrl,
    client_id: actualAuthProvider.auth.clientId,
    redirect_uri: redirect,
    response_type: 'id_token token',
    automaticSilentRenew: true,
    loadUserInfo: true,
    /* eslint-enable @typescript-eslint/camelcase */
  };
  return oidcConfig;
}

async function login(authMgr: Oidc.UserManager): Promise<string> {
  const user = window.location.hash
    ? await authMgr.signinRedirectCallback()
    : await authMgr.getUser();

  window.history.pushState(
    '',
    document.title,
    window.location.pathname + window.location.search,
  );

  if (user) {
    if (user.expired || !user.access_token) {
      await authMgr.signinRedirect();
    }
    token = user.access_token;
    return token;
  }
  await authMgr.removeUser();
  await authMgr.signinRedirect();
  return '';
}

function init(): Promise<string> {
  const oidcConfig = createAuthConfig();
  const authMgr = new Oidc.UserManager(oidcConfig);
  return login(authMgr);
}

async function getUserInfo() {
  const actualAuthProvider = getActualAuthProvider();
  const axiosInstance = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

  const info = await axiosInstance.get(actualAuthProvider.userEndpoint);
  if (!info) return null;
  return info.data;
}

async function getUserProjects() {
  const userInfo = await getUserInfo();
  const projectPrefix = '/bbp-dev-proj';
  const regexp = `${projectPrefix}(\\d+)`;

  const projects = userInfo.groups
    .filter((g: string) => g.startsWith(projectPrefix))
    .map((groupString: string) => {
      const match = groupString.match(regexp);
      if (!match || !match.length) return false;
      return `proj${match[1]}`;
    })
    .filter((group: string) => group);
  return projects;
}

export default {
  init,
  getUserProjects,
};
