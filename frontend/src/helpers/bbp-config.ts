
interface AuthProviderInterface {
  auth: {
    clientId: string;
    authUrl: string;
  };
  userEndpoint: string;
}

const configBBP: AuthProviderInterface = {
  auth: {
    clientId: 'sim-launcher-ui-unicore',
    authUrl: 'https://bbpauth.epfl.ch/auth/realms/BBP',
    // clientId: '3a967e06-d416-4b2e-b6f8-53af758bdd7f',
    // authUrl: 'https://services.humanbrainproject.eu/oidc',
  },
  userEndpoint: 'https://bbpauth.epfl.ch/auth/realms/BBP/protocol/openid-connect/userinfo',
  // userEndpoint: '',
};

export default configBBP;
