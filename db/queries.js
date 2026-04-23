const pool = require('./pool');

async function createUser({firstName, lastName, email, password}){
    const { rows } = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
         [firstName, lastName, email, password]
    );
    return rows[0];
}

async function getUserByEmail(email){
    const { rows } = await pool.query(
        `SELECT * FROM users WHERE email=$1`,[email]
    );
    return rows[0];
}

async function getUserById(id){
    const { rows } = await pool.query(
        `SELECT * FROM users WHERE id=$1`, [id]
    );
    return rows[0];
}

async function createMessage({ title, text, userId }){
    const { rows } = await pool.query(
        `INSERT INTO messages (title, text, user_id) VALUES ($1,$2,$3) RETURNING *`,[title, text, userId]
    );
    return rows[0];
};

async function getAllMessages(){
    const { rows } = await pool.query(
        `SELECT messages.*, users.first_name, users.last_name
         FROM messages JOIN users ON messages.id = users.id
         ORDER BY created_at DESC`
    );
    return rows;
}

async function makeMember(userId) {
    await pool.query(
        `UPDATE users SET is_member = TRUE WHERE id=$1`,[userId]
    );
}

async function deleteMessages(id) {
    await pool.query(
        `DELETE FROM messages WHERE id=$1`,[id]
    );
}

async function makeAdmin(userId) {
    await pool.query(
        `UPDATE users SET is_admin = TRUE WHERE id=$1`, [userId]
    );
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    createMessage,
    getAllMessages,
    makeMember,
    deleteMessages,
    makeAdmin,
};