// src/routes/test-db/+page.server.js
import { db } from '$lib/db';
// Generate hash to use in the SQL insert
import { hashPassword } from '$lib/server/auth.js';

export async function load() {
	generateHashForAdmin();

	async function generateHashForAdmin() {
		const adminPassword = 'Rqp9dgN2t5MbHAYemQ4jGW3TrJvLyUsDc8ZB6KSk7zCEfFXVPu';
		const hashedPassword = await hashPassword(adminPassword);
		console.log('Hashed Admin Password:', hashedPassword);
	}
}
