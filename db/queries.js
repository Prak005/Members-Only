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

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    createMessage,
};