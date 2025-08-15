import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { BaseExternalAccountClient, GoogleAuth, OAuth2Client } from 'google-auth-library';
export interface CredentialProps {
  installed: Installed;
}

export interface Installed {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}

export type GoogleCLientWithAuth = string | BaseExternalAccountClient | GoogleAuth<JSONClient> | OAuth2Client;
