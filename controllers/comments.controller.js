const { fetchArticleById } = require("../models/articles.model")
const { fetchCommentsByArticleId, insertCommentByArticleId } = require("../models/comments.model")

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id: id} = req.params
    fetchArticleById(id)
    .then(()=>fetchCommentsByArticleId(id))
    .then((comments)=>{res.status(200).send({comments})})
    .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id: id} = req.params
    const newComment = req.body
    fetchArticleById(id)
    .then(()=>insertCommentByArticleId(id, newComment))
    .then((comment)=>{res.status(201).send({comment})})
    .catch(err=>{
        if (err.code === '23503') res.status(404).send({message: 'user not found'})
        next(err)
    })
}