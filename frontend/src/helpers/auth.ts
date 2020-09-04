
import axios from 'axios';
import Oidc from 'oidc-client';
import configBBP from '@/helpers/bbp-config';
import { TokenAndUser } from '@/interfaces/auth';

let token = '';

function getActualAuthProvider() {
  return configBBP;
}

function createAuthConfig() {
  const actualAuthProvider = getActualAuthProvider();
  const redirect = window.location.origin
    + process.env.BASE_URL
    + window.location.pathname
    + window.location.search;

  const oidcConfig = {
    /* eslint-disable camelcase */
    authority: actualAuthProvider.auth.authUrl,
    client_id: actualAuthProvider.auth.clientId,
    redirect_uri: redirect,
    response_type: 'id_token token',
    automaticSilentRenew: true,
    loadUserInfo: true,
    /* eslint-enable camelcase */
  };
  return oidcConfig;
}

async function login(authMgr: Oidc.UserManager): Promise<TokenAndUser> {
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
    const userId = user.profile.preferred_username;
    if (!userId) throw new Error('No user was found');

    return {
      token,
      userId,
    };
  }
  await authMgr.removeUser();
  await authMgr.signinRedirect();
  return {} as TokenAndUser;
}

function init(): Promise<TokenAndUser> {
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
  // to sort with string and numbers
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const projectsSorted = projects.sort(collator.compare);
  return projectsSorted;
}

export default init;

export {
  init,
  getUserProjects,
};
