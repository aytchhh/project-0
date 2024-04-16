const db = require('../db/connection')

exports.fetchArticleById = (id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        return (rows.length===0) ? Promise.reject({status: 404, message: 'article not found'}) : rows[0];
      })
}