'use server';

import { cookies } from 'next/headers';
import type { Notification, NotificationAPIResponse, NotificationQueryParams } from '@/notification_app_fe/types';

const EVAL_BASE = 'http://20.207.122.201/evaluation-service';
const NOTIFICATION_API_URL = `${EVAL_BASE}/notifications`;
const LOG_API_URL = `${EVAL_BASE}/logs`;
const AUTH_URL = `${EVAL_BASE}/auth`;
const REGISTER_URL = `${EVAL_BASE}/register`;

const AUTH_COOKIE = 'auth_token';
const AUTH_MAX_AGE = 60 * 60 * 24 * 7;

interface EvaluationAuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export type EvaluationRegisterPayload = {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
};

export type RegisterEvaluationResult =
  | (EvaluationRegisterPayload & { ok: true; clientID: string; clientSecret: string })
  | { ok: false; message: string };

async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: AUTH_MAX_AGE,
  });
}

export async function registerEvaluationAccount(
  payload: EvaluationRegisterPayload
): Promise<RegisterEvaluationResult> {
  try {
    const res = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let body: Record<string, unknown> = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      return { ok: false, message: text.slice(0, 200) || `HTTP ${res.status}` };
    }
    if (!res.ok) {
      const msg =
        typeof body.message === 'string'
          ? body.message
          : typeof body.error === 'string'
            ? body.error
            : `Registration failed (${res.status})`;
      return { ok: false, message: msg };
    }
    const clientID = body.clientID as string | undefined;
    const clientSecret = body.clientSecret as string | undefined;
    if (!clientID || !clientSecret) {
      return { ok: false, message: 'Invalid registration response (missing client credentials)' };
    }
    return {
      ok: true,
      email: String(body.email ?? payload.email),
      name: String(body.name ?? payload.name),
      rollNo: String(body.rollNo ?? payload.rollNo),
      accessCode: String(body.accessCode ?? payload.accessCode),
      mobileNo: String(body.mobileNo ?? payload.mobileNo),
      githubUsername: String(body.githubUsername ?? payload.githubUsername),
      clientID,
      clientSecret,
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Network error' };
  }
}

export type SignInPayload = {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
};

export async function signInWithEvaluationService(
  payload: SignInPayload
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name,
        rollNo: payload.rollNo,
        accessCode: payload.accessCode,
        clientID: payload.clientID,
        clientSecret: payload.clientSecret,
      }),
    });
    const text = await res.text();
    let body: EvaluationAuthResponse & Record<string, unknown> = {} as EvaluationAuthResponse &
      Record<string, unknown>;
    try {
      body = text ? JSON.parse(text) : ({} as EvaluationAuthResponse);
    } catch {
      return { ok: false, message: text.slice(0, 200) || `HTTP ${res.status}` };
    }
    if (!res.ok) {
      const msg =
        typeof body.message === 'string'
          ? body.message
          : typeof body.error === 'string'
            ? body.error
            : `Sign-in failed (${res.status})`;
      return { ok: false, message: msg };
    }
    if (!body.access_token) {
      return { ok: false, message: 'No access_token in auth response' };
    }
    await setAuthCookie(body.access_token);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Network error' };
  }
}

function buildQueryString(params: NotificationQueryParams): string {
  const queryParts: string[] = [];

  if (params.limit) {
    queryParts.push(`limit=${params.limit}`);
  }
  if (params.page) {
    queryParts.push(`page=${params.page}`);
  }
  if (params.notification_type && params.notification_type !== 'All') {
    queryParts.push(`notification_type=${params.notification_type}`);
  }

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
}

export async function fetchNotificationsAction(
  params: NotificationQueryParams = {},
  tokenOverride: string = ''
): Promise<Notification[]> {
  const queryString = buildQueryString(params);
  const url = `${NOTIFICATION_API_URL}${queryString}`;

  try {
    const jar = await cookies();
    const token = tokenOverride || jar.get(AUTH_COOKIE)?.value || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: NotificationAPIResponse = await response.json();
    return data.notifications;
  } catch (error) {
    throw error;
  }
}

export async function logAction(
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<{ logID: string; message: string } | null> {
  try {
    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}
