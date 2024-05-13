const db = require('../db/connection');
const { getSlug } = require('./utils');

exports.fetchArticleById = (id) => {
    return db.query(`
    SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])
        .then(({ rows }) => {
            return (rows.length === 0) ? Promise.reject({ status: 404, message: 'article not found' }) : rows[0];
        })
}

exports.fetchArticles = (query, queryKeys) => {
    const sqlValue = []
    const validQuery = ['topic', 'sort_by', 'order']
    const validSortBy = ["article_id", "author", "title", "topic", "created_at", "votes", "article_img_url", "comment_count"]
    const validOrder = ['ASC', 'DESC']
    const allValid = queryKeys.every((query)=>validQuery.includes(query))

    if (!allValid) return Promise.reject({status: 400, message: 'Invalid query'})

    let sqlStr = `
    SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles LEFT JOIN comments
    ON articles.article_id = comments.article_id 
    `

    if (query.topic) {
        sqlStr += `WHERE articles.topic = $1 `
        sqlValue.push(query.topic)
    }

    sqlStr += `GROUP BY articles.article_id `

    if (query.sort_by) {
        if (!validSortBy.includes(query.sort_by)) return Promise.reject({ status: 400, message: 'Invalid sort' })
        sqlStr += `ORDER BY ${query.sort_by} `
    } else sqlStr += `ORDER BY created_at `

    if (query.order) {
        if (!validOrder.includes(query.order.toUpperCase())) return Promise.reject({ status: 400, message: 'Invalid order' })
        sqlStr += `${query.order};`
    } else sqlStr += `DESC;`

    return getSlug()
        .then((topics)=>{
            if (query.topic && !topics.includes(query.topic)) return Promise.reject({ status: 404, message: 'article not found' })
            return db.query(sqlStr, sqlValue)
        })
        .then(({ rows }) => {
            return rows
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