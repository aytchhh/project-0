const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json')

beforeEach(async()=>await seed(testData))

afterAll(()=>db.end())

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

    test('GET:404 responds with an error message when given an invalid route', ()=>{
        return request(app).get('/api/not-a-route').expect(404)
        .then(({body: {message}})=>{
            expect(message).toBe('Invalid endpoint')
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