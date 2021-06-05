var express = require('express')
var { randomBytes } = require('crypto')
var cors = require('cors')
var axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json({ extended: true }))

const commentsByPostId = {}

app.get('/posts/:id/comments', (request, response) => {
  response.send(commentsByPostId[request.params.id])
})

app.post('/posts/:id/comments', async (request, response) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = request.body
  const comments = commentsByPostId[request.params.id] || []
  comments.push({
    id: commentId,
    content,
    status: 'pending',
  })
  commentsByPostId[request.params.id] = comments

  await axios.post('http://localhost:4005/events', {
    type: 'COMMENT_CREATED',
    data: {
      id: commentId,
      content,
      postId: request.params.id,
      status: 'pending',
    },
  }).catch((err) => {
    console.log(err.message)
  })
  response.status(201).send(comments)
})

app.post('/events', async (request, response) => {
  const { type, data } = request.body
  if (type === 'COMMENT_MODERATED') {
    const { postId, id, status } = data
    const comments = commentsByPostId[postId]
    const comment = comments.find(c => c.id === id)
    comment.status = status
    
    await axios.post('http://localhost:4005/events', {
      type: 'COMMENT_UPDATED',
      data: request.body.data,
    }).catch((err) => {
      console.log(err.message)
    })
  }
  response.send({})
})

app.listen(4001, () => {
  console.log('Listening on 4001')
})