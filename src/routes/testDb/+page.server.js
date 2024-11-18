// src/routes/test-db/+page.server.js
import { db } from '$lib/db';

export async function load() {
  try {
    const result = await db.query('SELECT NOW()');
    return {
      dbConnected: true,
      time: result.rows[0].now
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      dbConnected: false,
      error: error.message
    };
  }
}