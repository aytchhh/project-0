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