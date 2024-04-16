const { fetchArticleById } = require("../models/articles.model")
const { fetchCommentsByArticleId } = require("../models/comments.model")

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id: id} = req.params
    fetchArticleById(id)
    .then(()=>fetchCommentsByArticleId(id))
    .then((comments)=>{res.status(200).send({comments})})
    .catch(next)
}