var express = require('express')
var axios = require('axios')

const app = express()
app.use(express.json({ extended: true }))

app.post('/events', async (request, response) => {
  const { type, data } = request.body
  if (type === 'COMMENT_CREATED') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved'
    await axios.post('http://localhost:4005/events', {
      type: 'COMMENT_MODERATED',
      data: { ...data, status },
    }).catch((err) => {
      console.log(err.message)
    })
  }

  response.sendStatus(204)
})

app.listen(4003, () => {
  console.log('Listening on 4003')
})