// src/routes/login/+page.server.js
import { db } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
import { randomBytes } from 'crypto';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const at = formData.get('at');
		const password = formData.get('password');

		try {
			const userRes = await db.query('SELECT * FROM account WHERE at = $1', [at]);
			const user = userRes.rows[0];

			if (!user || password !== user.password) {
				return { success: false, message: 'Invalid username or password' };
			}

			const sessionToken = randomBytes(100).toString('hex');
			const createdAt = new Date();
			const expiredAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 1 day from now

			await db.query(
				'INSERT INTO session_tokens (account_id, token, createdat, expiresat) VALUES ($1, $2, $3, $4)',
				[user.id, sessionToken, createdAt, expiredAt]
			);

			cookies.set('sessionToken', sessionToken, {
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60 * 24 // 1 day
			});

			const adminRes = await db.query('SELECT * FROM admin WHERE account_id = $1 LIMIT 1', [
				user.id
			]);
			if (adminRes.rows[0]) {
				//throw redirect(302, '../(authed)/(admin)/episodes');
			}

			const memberRes = await db.query('SELECT * FROM member WHERE account_id = $1 LIMIT 1', [
				user.id
			]);
			if (memberRes.rows[0]) {
				//throw redirect(302, '../(authed)/(member)/profile');
			}
		} catch (err) {
			console.error('Database error:', err);
			return { success: false, message: 'Database error' };
		}
	}
};
