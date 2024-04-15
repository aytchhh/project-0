const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

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