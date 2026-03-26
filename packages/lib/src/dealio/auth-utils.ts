'use server';

import { getAccessToken, getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '../logto.config';

const API_RESOURCE = process.env.LOGTO_ECOMMERCE_AUDIENCE!;
const ORGANIZATION_ID = process.env.LOGTO_ORGANIZATION_ID!;

/**
 * Helper to securely extract the active user's Logto access token
 */
export async function getUserToken(): Promise<string> {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    throw new Error('UNAUTHORIZED: User is not logged in');
  }

  const token = await getAccessToken(logtoConfig, API_RESOURCE, ORGANIZATION_ID);

  if (!token) {
    throw new Error('UNAUTHORIZED: Could not retrieve access token');
  }

  return token;
}

/**
 * Helper to securely extract the active user's Logto context (user info)
 */
export async function getUser() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims) {
    return null;
  }

  return {
    id: claims.sub,
    username: claims.username,
    name: claims.name,
    email: claims.email,
  };
}
