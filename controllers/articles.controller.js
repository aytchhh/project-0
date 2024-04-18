const { fetchArticleById, fetchArticles, updateArticleById } = require("../models/articles.model")


exports.getArticleById = (req, res, next) => {
    const {article_id: id} = req.params
    fetchArticleById(id)
    .then((article)=>{res.status(200).send({article})})
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const query = req.query
    const queryKeys = Object.keys(query)
    fetchArticles(query, queryKeys)
    .then((articles)=>{res.status(200).send({articles})})
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const {article_id : id} = req.params
    const newVote = req.body
    updateArticleById(id, newVote)
    .then((article)=>{res.status(200).send({article})})
    .catch(next)
}