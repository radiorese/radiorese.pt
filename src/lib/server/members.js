import { db } from '$lib/db.js';

export async function fetchActiveMembers() {
    try {

        let activeMembers = await db.query('SELECT * FROM member WHERE isactive = true ORDER BY name ASC');
        activeMembers = activeMembers.rows;
        for (let row of activeMembers) {
            let memberAt = await db.query('SELECT * FROM account WHERE id = $1', [row.account_id]);
            row.at = memberAt.rows[0] ?.at || null;
        }

        return activeMembers;

    } catch (err) {
        console.error('Error loading active members:', err);
    }
}

export async function fetchInactiveMembers() {
    try {
        let inactiveMembers = await db.query('SELECT * FROM member WHERE isactive = false ORDER BY name ASC');
        inactiveMembers = inactiveMembers.rows;
        for (let row of inactiveMembers) {
            let memberAt = await db.query('SELECT * FROM account WHERE id = $1', [row.account_id]);
            row.at = memberAt.rows[0] ?.at || null;
        }

        return inactiveMembers;

    } catch (err) {
        console.error('Error loading inactive members:', err);
    }
}

export async function fetchAllMembers(){
    try {
        let allMembers = await db.query('SELECT * FROM member ORDER BY name ASC');
        allMembers = allMembers.rows;
        for (let row of allMembers) {
            let memberAt = await db.query('SELECT * FROM account WHERE id = $1', [row.account_id]);
            row.at = memberAt.rows[0] ?.at || null;
        }
        return allMembers; 

    } catch (err) {
        console.error('Error loading members:', err);
    }
}

export async function fetchMemberById(id) {
    try {
        let member = await db.query('SELECT * FROM member WHERE account_id = $1', [id]);
        member = member.rows[0];
        let memberAt = await db.query('SELECT * FROM account WHERE id = $1', [member.account_id]);
        member.at = memberAt.rows[0] ?.at || null;
        return member;

    } catch (err) {
        console.error('Error loading member:', err);
    }
}