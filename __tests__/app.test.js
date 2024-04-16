const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json')

beforeEach(async()=>await seed(testData))

afterAll(()=>db.end())

describe('/api/not-a-route',()=>{
    test('GET:404 responds with an error message when given an invalid route', ()=>{
        return request(app).get('/api/not-a-route').expect(404)
        .then(({body: {message}})=>{
            expect(message).toBe('Invalid endpoint')
        })
    })
})

describe('/api/topics', ()=>{
    test('GET:200 responds with an array containing all topics in correct format', ()=>{
        return request(app).get('/api/topics').expect(200)
        .then(({body: {topics}})=>{
            expect(topics.length).toBe(3);
            topics.forEach((topic)=>{
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        })
    })
})

describe('/api', ()=>{
    test('GET:200 responds with an object describing all the available endpoints',()=>{
        return request(app).get('/api').expect(200)
        .then(({body})=>{
            expect(typeof body.endpoints).toBe('object')
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})

describe('/api/articles/:article_id', ()=>{
    test('GET:200 responds with a specific article object', ()=>{
        const article_1 = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          }
        return request(app).get('/api/articles/1').expect(200)
        .then(({body: {article}})=>{
            expect(article).toMatchObject(article_1)
        })
    })

    test('GET:404 responds with an error message when given a valid but non-existent id', ()=>{
        return request(app).get('/api/articles/999999').expect(404)
        .then(({body: {message}})=>{
            expect(message).toBe('article not found')
        })
    })

    test('GET:400 responds with an error message when given an invalid id', ()=>{
        return request(app).get('/api/articles/dog').expect(400)
        .then(({body: {message}})=>{
            expect(message).toBe('Bad request')
        })
    })
})

describe('/api/articles', ()=>{
    test('GET:200 responds with an array of article objects sorted by date in descending order', ()=>{
        return request(app).get('/api/articles').expect(200)
        .then(({body: {articles}})=>{
            expect(articles.length).toBe(13)

            expect(articles).toBeSortedBy('created_at', {descending: true})

            articles.forEach((article)=>{
                expect(article).not.toHaveProperty('body')
                expect(article).toMatchObject(
                    {
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String)
                    }
                )
            })
        })
    })
})

describe('/api/articles/:article_id/comments', ()=>{
    test('GET:200 responds with an array of comments for the given article_id, sorted by date in descending order', ()=>{
        return request(app).get('/api/articles/9/comments').expect(200)
        .then(({body: {comments}})=>{
            expect(comments.length).toBe(2)
            
            expect(comments).toBeSortedBy('created_at', {descending: true})

            comments.forEach((comment)=>{
                expect(comment).toMatchObject(
                    {
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        article_id: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String)
                    }
                )
            })
        })
    })

    test('GET:200 responds with an empty array when article has no comments', ()=>{
        return request(app).get('/api/articles/7/comments').expect(200)
        .then(({body: {comments}})=>{
            expect(Array.isArray(comments)).toBe(true)
            expect(comments.length).toBe(0)
        })
    })

    test('GET:404 responds with an error message when given a valid but non-existent id', ()=>{
        return request(app).get('/api/articles/999999/comments').expect(404)
        .then(({body: {message}})=>{
            expect(message).toBe('article not found')
        })
    })

    test('GET:400 responds with an error message when given an invalid id', ()=>{
        return request(app).get('/api/articles/dog/comments').expect(400)
        .then(({body: {message}})=>{
            expect(message).toBe('Bad request')
        })
    })
})