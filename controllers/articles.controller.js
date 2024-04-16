const { fetchArticleById } = require("../models/articles.model")


exports.getArticleById = (req, res, next) => {
    const {article_id: id} = req.params
    fetchArticleById(id)
    .then((article)=>{res.status(200).send({article})})
    .catch(next)
}