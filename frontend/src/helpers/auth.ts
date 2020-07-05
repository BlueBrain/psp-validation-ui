
import Oidc from 'oidc-client';
import configHBP from '@/helpers/hbp-config';
import { TokenAndUser } from '@/interfaces/auth';

let token = '';

function getActualAuthProvider() {
  return configHBP;
}

function createAuthConfig() {
  const actualAuthProvider = getActualAuthProvider();
  const redirect = window.location.origin
    + process.env.BASE_URL
    + (window.location.pathname === '/' ? '' : window.location.pathname)
    + window.location.search;

  const oidcConfig = {
    /* eslint-disable camelcase */
    authority: actualAuthProvider.auth.authUrl,
    client_id: actualAuthProvider.auth.clientId,
    redirect_uri: redirect,
    response_type: 'id_token token',
    automaticSilentRenew: true,
    loadUserInfo: true,
    scope: actualAuthProvider.auth.scope || 'openid',
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
    const userId = user.profile.jti;
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

export default init;

export {
  init,
};
