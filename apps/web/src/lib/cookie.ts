'use server';

import { cookies } from 'next/headers';

export async function createCookie(name: string, value: string) {
  const oneDay = 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + oneDay);
  cookies().set(name, value, {
    expires,
  });
}

export async function fetchCookie(name: string) {
  return cookies().get(name)?.value;
}

export async function deleteCookie(name: string) {
  cookies().delete(name);
}
