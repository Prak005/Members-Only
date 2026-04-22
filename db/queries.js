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

module.exports = {
    createUser,
    getUserByEmail,
};