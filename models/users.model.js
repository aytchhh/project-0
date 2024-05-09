const db = require('../db/connection')

exports.fetchUsers = ()=>{
    return db.query(`SELECT * FROM users;`)
    .then(({rows})=>rows)
}

exports.fetchUserByUsername = (username)=>{
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
        return (rows.length === 0) ? Promise.reject({ status: 404, message: 'user not found' }) : rows[0];
    })
}