var express = require('express')
var cors = require('cors')
var axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json({ extended: true }))

const posts = {}

const handleEvent = (type, data) => {
  if (type === 'POST_CREATED') {
    const { id, title } = data
    posts[id] = { id, title, comments: [] }
  }

  if (type === 'COMMENT_CREATED') {
    const { id, content, postId, status } = data
    const post = posts[postId]
    post.comments.push({ id, content, status })
  }

  if (type === 'COMMENT_UPDATED') {
    const { id, content, postId, status } = data
    const post = posts[postId]
    const comment = post.comments.find(c => c.id === id)
    comment.content = content
    comment.status = status
  }
}

app.get('/posts', (request, response) => {
  response.send(posts)
})

app.post('/events', (request, response) => {
  const { type, data } = request.body
  handleEvent(type, data)
  response.sendStatus(204)
})

app.listen(4002, async () => {
  console.log('Listening on 4002')
  try {
    const response = await axios.get('http://localhost:4005/events')
    for (let event of response.data) {
      console.log("Processing event:", event.type)
      handleEvent(event.type, event.data)
    }
  } catch (error) {
    console.log(error)
  }
})