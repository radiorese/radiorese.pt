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
		const sessionRes = await db.query('SELECT * FROM session_tokens WHERE token = $1', [
			sessionToken
		]);
		const session = sessionRes.rows[0];

		if (!session || new Date(session.expiresat) < new Date()) {
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

export async function deleteExpiredTokens() {
	try {
		await db.query('DELETE FROM session_tokens WHERE expiresat < NOW()');
	} catch (err) {
		console.error('Error deleting expired tokens:', err);
	}
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const combinedBuffer = new Uint8Array(salt.length + passwordBuffer.length);
  combinedBuffer.set(salt);
  combinedBuffer.set(passwordBuffer, salt.length);
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${salt.join(',')}:${hashHex}`;
}

export async function comparePassword(plainTextPassword, storedHash) {
  const [saltStr, originalHash] = storedHash.split(':');
  const salt = new Uint8Array(saltStr.split(',').map(Number));
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(plainTextPassword);
  const combinedBuffer = new Uint8Array(salt.length + passwordBuffer.length);
  combinedBuffer.set(salt);
  combinedBuffer.set(passwordBuffer, salt.length);
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  console.log('computedHash:', computedHash);
  console.log('originalHash:', originalHash);
  console.log('computedHash === originalHash:', computedHash === originalHash);
  return computedHash === originalHash;
}
