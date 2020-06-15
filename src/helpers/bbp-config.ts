
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
  },
  userEndpoint: 'https://bbpauth.epfl.ch/auth/realms/BBP/protocol/openid-connect/userinfo',
};

export default configBBP;
