const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then(({ rows }) => {
            return (rows.length === 0) ? Promise.reject({ status: 404, message: 'article not found' }) : rows[0];
        })
}

exports.fetchArticles = () => {
    return db.query(`SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`)
        .then(({ rows }) => rows)
}