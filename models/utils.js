const db = require('../db/connection')

exports.getSlug = ()=>{
    return db.query(`SELECT slug FROM topics;`)
        .then(({rows})=>{
            return rows.reduce((acc, current)=>{
                acc.push(current.slug)
                return acc
            }, [])
        })
}