// src/routes/login/+page.server.js
import { db } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';


export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const at = formData.get('at');
		const password = formData.get('password');

		try {
			const userRes = await db.query('SELECT * FROM account WHERE at = $1', [at]);
			const user = userRes.rows[0];

			const adminRes = await db.query('SELECT * FROM admin WHERE account_id = $1', [user.id]);
            const admin = adminRes.rows[0];

			const memberRes = await db.query('SELECT * FROM member WHERE account_id = $1', [user.id]);
            const member = memberRes.rows[0];

			if (user && password === user.password) {
				if (admin) {
					return { success: true, message: 'Login successful - admin' };
				} else if (member) {
					return { success: true, message: 'Login successful - member' };
				}
			} else {
				return { success: false, message: 'Invalid username or password' };
			}
		} catch (err) {
			return { success: false, message: 'Database error' };
		}
	}
};
