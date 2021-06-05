var express = require('express')
var axios = require('axios')

const app = express()
app.use(express.json({ extended: true }))

const events = []

app.get('/events', (request, response) => {
  response.send(events)
})

app.post('/events', (request, response) => {
  const { body: event } = request
  events.push(event)
  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message)
  })
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message)
  })
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message)
  })
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err.message)
  })
  response.send({ status: 'O.K.' })
})

app.listen(4005, () => {
  console.log('Listening on 4005')
})