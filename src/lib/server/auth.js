// src/lib/auth.js
import { db } from '$lib/db.js';

/**
 @param {string} sessionToken - The session token from cookies.
 @returns {Promise<{isAdmin: boolean, userId: number }>} - The authentication status and user information.
*/

export async function verifySession(sessionToken) {
  if (!sessionToken) {
    return null;
  }

  try {
    const sessionRes = await db.query('SELECT * FROM session_tokens WHERE token = $1', [sessionToken]);
    const session = sessionRes.rows[0];

    if (!session) {
      return null;
    }

    const userRes = await db.query('SELECT * FROM account WHERE id = $1', [session.account_id]);
    const user = userRes.rows[0];

    if (!user) {
      return null;
    }

    const adminRes = await db.query('SELECT * FROM admin WHERE account_id = $1 LIMIT 1', [user.id]);
    const isAdmin = adminRes.rows.length > 0;

    return { isAdmin, id: user.id, at: user.at };
  } catch (err) {
    console.error('Error verifying session:', err);
    return null;
  }
}