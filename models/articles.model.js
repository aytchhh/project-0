const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then(({ rows }) => {
            return (rows.length === 0) ? Promise.reject({ status: 404, message: 'article not found' }) : rows[0];
        })
}

exports.fetchArticles = (topic) => {
    let queryStr = `
    SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
    FROM articles LEFT JOIN comments
    ON articles.article_id = comments.article_id
    `
    const queryValue = []

    if (topic) {
        queryStr += `WHERE articles.topic = $1`
        queryValue.push(topic)
    }

    queryStr += `
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `

    return db.query(queryStr, queryValue)
        .then(({ rows }) => {
            return rows.length === 0 ? Promise.reject({ status: 404, message: 'article not found' }) : rows;
        })
}

exports.updateArticleById = (id, { inc_votes: newVote }) => {
    return db.query(`UPDATE articles
        SET votes = CASE
                    WHEN votes + $1 > 0  THEN votes + $1
                    ELSE 0
                    END
        WHERE article_id = $2
        RETURNING *;`, [newVote, id])
        .then(({ rows })=>{
            return (rows.length === 0) ? Promise.reject({ status: 404, message: 'article not found' }) : rows[0];
        })
}