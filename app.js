const express = require('express')
const cors = require('cors')
const { getEndpoints } = require('./controllers/api.controller');
const { getTopics } = require('./controllers/topics.controller');
const { getUsers } = require('./controllers/users.controller')
const { getArticles, getArticleById, patchArticleById } = require('./controllers/articles.controller')
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require('./controllers/comments.controller');
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require('./errors/index');

const app = express()

app.use(cors())

app.use(express.json());

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/api/users', getUsers);

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Path not found' });
})

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app