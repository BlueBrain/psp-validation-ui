
interface AuthProviderInterface {
  auth: {
    clientId: string;
    authUrl: string;
    scope?: string;
    userEndpoint?: string;
  };
}

const configHBP: AuthProviderInterface = {
  auth: {
    // -- EBrains
    // clientId: 'test-psp-locally-3',
    // authUrl: 'https://iam.ebrains.eu/auth/realms/hbp',
    // scope: 'team email profile openid collab.drive clb.drive:read clb.drive:write group web-origins roles',
    // -- Collab 1
    clientId: 'aa7fd69b-694e-4330-b4bb-707dd167f035',
    authUrl: 'https://services.humanbrainproject.eu/oidc',
    scope: 'openid',
  },
};

export default configHBP;
