import express from 'express'
import fetch from 'node-fetch'
import morgan from 'morgan'


import {Resp} from './response'

const port = 8083

const app = express()
app.use(express.json())
app.use(morgan('tiny'))

app.post("/reserve", async (req, res) => {
  const { body } = req
  const seatCount = body.count
  const trainId = body.train_id
  let rep = new Resp(seatCount,trainId)

  let response = await fetch(`http://localhost:8081/reserve`, {
    method: 'POST',
    body: JSON.stringify(rep),
    headers: { 'Content-Type': 'application/json' }
  })

  const status = response.status
  if (status != 200) {
    res.status(500)
    const message = await response.text()
    res.send(message)
    return
  }

  // Step 5: send back the reservation that was made
  res.send(rep)
})



app.listen(port, () => {
  console.log(`Ticket Office listening on port ${port}`)
})