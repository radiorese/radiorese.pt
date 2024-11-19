// src/hooks.server.js
import { redirect } from '@sveltejs/kit';
import { verifySession } from '$lib/server/auth.js';

/** @type {import('@sveltejs/kit').Handle} */

export async function handle({ event, resolve }) {
  const sessionToken = event.cookies.get('sessionToken');

  const { isAdmin, userId } = await verifySession(sessionToken);

  event.locals.user = { isAdmin, userId };

  console.log('User:', event.locals.user);

  return resolve(event);
}