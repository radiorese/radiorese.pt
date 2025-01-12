import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ cookies }) {
  // Clear the session token from cookies
  cookies.set('sessionToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0 // Expire the cookie immediately
  });

  // Redirect to the login page
  redirect(303, '/studio/login');
}