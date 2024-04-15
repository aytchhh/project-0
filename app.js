const express = require('express')
const {getTopics} = require('./controllers/topics.controller');
const {getEndpoints} = require('./controllers/api.controller')
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require('./errors/index');

const app = express()

app.use(express.json());

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics);

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Invalid endpoint' });
})

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app