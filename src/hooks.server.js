// src/hooks.server.js
import { redirect } from '@sveltejs/kit';
import { verifySession } from '$lib/server/auth.js';

const adminPaths = [
  '/studio/schedule',
  '/studio/members',
  '/studio/episodes'
];

/** @type {import('@sveltejs/kit').Handle} */

export async function handle({ event, resolve }) {

  const sessionToken = event.cookies.get('sessionToken');
  const user = await verifySession(sessionToken);

  if (user) {
    event.locals.user = user;
  } else {
    event.locals.user = null;
  }

  console.log('User:', event.locals.user);

  if (event.url.pathname.startsWith('/studio') && event.url.pathname !== '/studio/login') {
    if (!event.locals.user || (event.locals.user.role !== 'admin' && adminPaths.includes(event.url.pathname))) {
      throw redirect(302, '/studio/login');
    }
  } else if (event.url.pathname === '/studio/login' && event.locals.user) {
    throw redirect(302, '/studio/programs');
  }

  return resolve(event);
}