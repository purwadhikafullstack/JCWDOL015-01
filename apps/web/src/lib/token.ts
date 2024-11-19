'use server';

import { cookies } from 'next/headers';

export async function createToken(token: string) {
  const oneDay = 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + oneDay);
  cookies().set('token', token, {
    expires,
  });
}

export async function fetchToken() {
  return cookies().get('token')?.value;

}

export async function deleteToken() {
  cookies().delete('token');
}
