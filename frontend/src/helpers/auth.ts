
import Oidc from 'oidc-client';
import configHBP from '@/helpers/hbp-config';
import { TokenAndUser } from '@/interfaces/auth';

let token = '';

function getActualAuthProvider() {
  return configHBP;
}

function createAuthConfig() {
  const actualAuthProvider = getActualAuthProvider();
  const redirectBase = window.location.origin + process.env.BASE_URL;

  const oidcConfig = {
    /* eslint-disable camelcase */
    authority: actualAuthProvider.auth.authUrl,
    client_id: actualAuthProvider.auth.clientId,
    response_type: 'id_token token',
    automaticSilentRenew: true,
    loadUserInfo: true,
    scope: actualAuthProvider.auth.scope || 'openid',
    redirect_uri: `${redirectBase}/callback.html`,
    post_logout_redirect_uri: `${redirectBase}/`,
    silent_redirect_uri: `${redirectBase}/silent-renew.html`,
    userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    accessTokenExpiringNotificationTime: 10,
    filterProtocolClaims: true,
    /* eslint-enable camelcase */
  };
  return oidcConfig;
}

async function login(authMgr: Oidc.UserManager): Promise<TokenAndUser> {
  const user = await authMgr.getUser();

  if (user) {
    if (user.expired || !user.access_token) {
      sessionStorage.setItem('savedUrl', window.location.href);
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
  sessionStorage.setItem('savedUrl', window.location.href);
  await authMgr.signinRedirect();
  throw new Error('user has no auth');
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
