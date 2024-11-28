import { db } from '$lib/db';
import { fetchActiveMembers, fetchInactiveMembers } from '$lib/server/members.js';

export async function load() {
    try {
        let activeMembers = await fetchActiveMembers();
        let inactiveMembers = await fetchInactiveMembers();
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
            success: '{name} adicionado com sucesso',
            credentialText,
            fileName: `credentiais ${name}.txt`
        };
    },

    editMember: async ({ request }) => {
        const data = await request.formData();
        const isActive = data.get('isActive') === 'on' ? true : false;
        const name = data.get('name');
        const email = data.get('email');
        const phone = data.get('phone');
        const at = data.get('at');
        const id = data.get('id');


        // check if at is already in use
        let atCheck = await db.query('SELECT * FROM account WHERE at = $1 AND id != $2', [at, id]);
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

        try{
            await db.query('UPDATE member SET name = $1, isactive = $2, email = $3, phone = $4 WHERE account_id = $5', [name, isActive, email, phone, id]);
            await db.query('UPDATE account SET at = $1 WHERE id = $2', [at, id]);
        } catch (err) {
            return {
                error: 'Erro ao editar membro' + err
            };
        }
        return {
            success: '{name} editado com sucesso',
        };
    },

    deleteMember: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');

        try {
            await db.query('DELETE FROM member WHERE account_id = $1', [id]);
            await db.query('DELETE FROM account WHERE id = $1', [id]);
            
        } catch (err) {
            return {
                error: 'Erro ao eliminar membro' + err
            };
        }
        return{
            success: '{name} apagado com sucesso'
        }
    },
};