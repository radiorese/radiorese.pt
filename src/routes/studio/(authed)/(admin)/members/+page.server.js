import { db } from '$lib/db';
import { error } from '@sveltejs/kit';

export async function load() {
    try {

        let activeMembers = await db.query('SELECT * FROM member WHERE isactive = true ORDER BY name ASC');
        activeMembers = activeMembers.rows;
        for (let row of activeMembers) {
            let memberAt = await db.query('SELECT * FROM account WHERE id = $1', [row.account_id]);
            row.at = memberAt.rows[0] ?.at || null;
        }

        let inactiveMembers = await db.query('SELECT * FROM member WHERE isactive = false ORDER BY name ASC');
        inactiveMembers = inactiveMembers.rows;
        for (let row of inactiveMembers) {
            let memberAt = await db.query('SELECT * FROM account WHERE id = $1', [row.account_id]);
            row.at = memberAt.rows[0] ?.at || null;
        }

        return {
            activeMembers,
            inactiveMembers,
        };
    } catch (err) {
        console.error('Error loading members:', err);
    }
}

export const actions = {

    addMember: async ({ request }) => {
        const data = await request.formData();
        const isActive = data.get('isActive') === 'on' ? true : false;
        const name = data.get('name');
        const email = data.get('email');
        const phone = data.get('phone');
        const at = data.get('at');
        const password = Math.random().toString(36).slice(-8);

        let highestId = await db.query('SELECT MAX(id) FROM account');
        highestId = highestId.rows[0].max || 0;
        let id = highestId + 1;

        // check if at is already in use
        let atCheck = await db.query('SELECT * FROM account WHERE at = $1', [at]);
        if (atCheck.rows.length > 0) {
            return {
                error: '@ já está em uso'
            };
        }

        // check if at only has alphanumeric characters
        if (!/^[a-zA-Z0-9]+$/.test(at)) {
            return {
                error: '@ inválido, é permitido apenas letras e números'
            };
        }

        // String for TXT file
        const credentialText = `@ - ${at}\nPassword - ${password}`;
        
        //insert to db
        try {
            await db.query('INSERT INTO account (id, at, password) VALUES ($1, $2, $3)', [id, at, password]);
            await db.query('INSERT INTO member (name, isactive, account_id, email, phone) VALUES ($1, $2, $3, $4, $5)', [name, isActive, id, email, phone]);
        } catch (err) {
            return {
                error: 'Erro ao adicionar membro' + err
            };
        }
        return {
            success: 'Membro adicionado com sucesso',
            credentialText,
            fileName: `credentiais ${name}.txt`

        };
    },

};