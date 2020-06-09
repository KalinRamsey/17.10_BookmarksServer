const app = require('../src/app');
const apiToken = process.env.API_TOKEN;

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .set({
        "Authorization": `bearer ${apiToken}`
      })
      .expect(200, "Hello, world!")
  })
})