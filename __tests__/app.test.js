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
            expect(message).toBe('Path not found')
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
    describe('GET', ()=>{
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

        test('GET:200 response object should now include comment_count', ()=>{
            const article_1 = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 11
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

    describe('PATCH', ()=>{
        const newVote = { inc_votes: 1 }
        test('PATCH:200 responds with newly updated article', ()=>{
            return request(app).patch('/api/articles/1').send(newVote).expect(200)
            .then(({body: {article}})=>{
                expect(article).toMatchObject(
                    {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 101,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                      }
                )
            })
        })

        test('PATCH:200 Votes can only be decreased to 0', ()=>{
            return request(app).patch('/api/articles/1').send({inc_votes : -200}).expect(200)
            .then(({body: {article}})=>{
                expect(article).toMatchObject(
                    {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                      }
                )
            })
        })

        test('PATCH:404 responds with an error message when given a valid but non-existent id', ()=>{
            return request(app).patch('/api/articles/999999').send(newVote).expect(404)
            .then(({body: {message}})=>{
                expect(message).toBe('article not found')
            })
        })

        test('PATCH:400 responds with an error message when given an invalid id', ()=>{
            return request(app).patch('/api/articles/dog').send(newVote).expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Bad request')
            })
        })

        test('PATCH: 400 responds with an error message when provided bad object', ()=>{
            return request(app).patch('/api/articles/dog').send({inc_votes: 'one'}).expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Bad request')
            })
        })

        test('PATCH: 400 responds with an error message when provided bad object', ()=>{
            return request(app).patch('/api/articles/dog').send({votes: 1}).expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Bad request')
            })
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
                        comment_count: expect.any(Number)
                    }
                )
            })
        })
    })
})

describe('/api/articles?queries', ()=>{
        test('GET:200 responds with an array of articles filtered by specified topic', ()=>{
            return request(app).get('/api/articles?topic=cats').expect(200)
            .then(({body: {articles}})=>{
                expect(articles.length).toBe(1)
                expect(articles[0]).toMatchObject(
                    {
                        article_id: 5,
                        author: 'rogersop',
                        title: 'UNCOVERED: catspiracy to bring down democracy',
                        topic: 'cats',
                        created_at: '2020-08-03T13:14:00.000Z',
                        votes: 0,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                        comment_count: 2
                      }
                )
            })
        })

        test('GET:200 responds with an empty array when topic has no related articles', ()=>{
            return request(app).get('/api/articles?topic=paper').expect(200)
            .then(({body: {articles}})=>{
                expect(Array.isArray(articles)).toBe(true)
                expect(articles.length).toBe(0)
            })
        })

        test('GET:400 responds with an error message when provided with invalid query', ()=>{
            return request(app).get('/api/articles?abc=1').expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Invalid query')
            })
        })

        test('GET:404 responds with an error message when provided with non-existent topic', ()=>{
            return request(app).get('/api/articles?topic=1').expect(404)
            .then(({body: {message}})=>{
                expect(message).toBe('article not found')
            })
        })

        test('GET:200 responds with an array of articles sorted by specified column', ()=>{
            return request(app).get('/api/articles?sort_by=comment_count').expect(200)
            .then(({body: {articles}})=>{
                expect(articles).toBeSortedBy('comment_count', {descending: true})
            })
        })

        test('GET:400 responds with an error message when provided with invalid sort_by', ()=>{
            return request(app).get('/api/articles?sort_by=1').expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Invalid sort')
            })
        })

        test('GET:200 responds with an array of articles ordered by correct order(ASC/DESC)', ()=>{
            return request(app).get('/api/articles?order=asc').expect(200)
            .then(({body: {articles}})=>{
                expect(articles).toBeSorted()
            })
        })

        test('GET:400 responds with an error message when provided with invalid order', ()=>{
            return request(app).get('/api/articles?order=up').expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Invalid order')
            })
        })
    })

describe('/api/articles/:article_id/comments', ()=>{
    describe('GET', ()=>{
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

    describe('POST', ()=>{
        test('POST:201 responds with newly added comment', ()=>{
            const newComment = {username: "lurker", body: "a comment"}
            return request(app).post('/api/articles/7/comments').send(newComment).expect(201)
            .then(({body: {comment}})=>{
                expect(comment).toMatchObject({
                    comment_id: 19,
                    body: 'a comment',
                    article_id: 7,
                    author: 'lurker',
                    votes: 0,
                    created_at: expect.any(String)
                })
            })
        })

        test('POST:400 responds with an error message when provided incomplete object', ()=>{
            return request(app).post('/api/articles/7/comments').send({username: "lurker"}).expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Bad request')
            })
        })

        test('POST:400 responds with an error message when provided bad object', ()=>{
            const newComment = {user: 'lurker', body: "a comment"}
            return request(app).post('/api/articles/7/comments').send(newComment).expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Bad request')
            })
        })

        test('POST:404 responds with an error message when provided non-existent username', ()=>{
            const newComment = {username: 'some user', body: "a comment"}
            return request(app).post('/api/articles/7/comments').send(newComment).expect(404)
            .then(({body: {message}})=>{
                expect(message).toBe('user not found')
            })
        })

        test('POST:400 responds with an error message when given an invalid article id', ()=>{
            const newComment = {username: 'lurker', body: 'a comment'}
            return request(app).post('/api/articles/dog/comments').send(newComment).expect(400)
            .then(({body: {message}})=>{
                expect(message).toBe('Bad request')
            })
        })

        test('POST:404 responds with an error message when given a valid but non-existent id', ()=>{
            const newComment = {username: 'lurker', body: 'a comment'}
            return request(app).post('/api/articles/999999/comments').send(newComment).expect(404)
            .then(({body: {message}})=>{
                expect(message).toBe('article not found')
            })
        })

    })
})

describe('/api/comments/:comment_id', ()=>{
    test('DELETE:204 deletes the specific comment and sends nothing back', ()=>{
        return request(app).delete('/api/comments/1').expect(204)
    })

    test('DELETE:404 responds with an error message when given a valid but non-existent id', () => {
        return request(app).delete('/api/comments/999999').expect(404)
        .then(({body: {message}}) => {
            expect(message).toBe('comment not found')
        });
    })

    test('DELETE:400 responds with an error message when given an invalid id', () => {
        return request(app).delete('/api/comments/dog').expect(400)
        .then(({body: {message}}) => {
            expect(message).toBe('Bad request')
        });
    })
})

describe('/api/users', ()=>{
    test('GET:200 responds with an array of user objects', ()=>{
        return request(app).get('/api/users').expect(200)
        .then(({body: {users}})=>{
            expect(users.length).toBe(4)

            users.forEach((user)=>{
                expect(user).toMatchObject(
                    {
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    }
                )
            })
        })
    })
})

describe('/api/users/:username', ()=>{
    test('GET:200 responds with a user object based on the username', ()=>{
        return request(app).get('/api/users/icellusedkars').expect(200)
        .then(({body: {user}})=>{
            expect(user).toEqual(
                {
                    username: 'icellusedkars',
                    name: 'sam',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                }
            )
        })
    })

    test('GET:404 responds with an error message when given non-existent username', ()=>{
        return request(app).get('/api/users/1').expect(404)
        .then(({body: {message}})=>{
            expect(message).toBe('user not found')
        })
    })


})