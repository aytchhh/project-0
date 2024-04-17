const db = require('../db/connection')

exports.fetchCommentsByArticleId = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC;`, [id])
    .then(({rows})=>rows)
}

exports.insertCommentByArticleId = (id, {username, body}) =>{
    return db.query(`INSERT INTO comments(article_id, author, body)
    VALUES($1, $2, $3)
    RETURNING *;`, [id, username, body])
    .then(({rows})=>rows[0])
}

exports.removeCommentById = (id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])
    .then(({rows})=>{
        if (rows.length===0) return Promise.reject({status: 404, message: 'comment not found'})
        return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [id])
    })
}