var express = require('express')
var { randomBytes } = require('crypto')
var cors = require('cors')
var axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json({ extended: true }))

const posts = {}

app.get('/posts', (request, response) => {
  response.send(posts)
})

app.post('/posts', async (request, response) => {
  const id = randomBytes(4).toString('hex')
  const { title } = request.body
  posts[id] = { id, title }

  await axios.post('http://localhost:4005/events', {
    type: 'POST_CREATED',
    data: { id, title },
  }).catch((err) => {
    console.log(err.message)
  })
  response.status(201).send(posts[id])
})

app.post('/events', (request, response) => {
  const { body: event } = request
  response.send({})
})

app.listen(4000, () => {
  console.log('Listening on 4000')
})