exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({message: 'Bad request'})
    next(err)
};

exports.customErrorHandler = (err, req, res, next) => {
    const {status, message} = err
    if (status && message) res.status(status).send({message})
    next(err)
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({ message: 'Internal server error' })
};