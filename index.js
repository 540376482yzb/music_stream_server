'use strict'

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const { DATABASE_URL, PORT, CLIENT_ORIGIN } = require('./config')
const app = express()

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
)

// app.use(
//   cors({
//     origin: CLIENT_ORIGIN
//   })
// )

app.use(express.json())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(express.static('public'))

app.use(function(req, res, next) {
  // console.log('404 error ran');
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  console.log(err)
  // console.log('error handler ran');
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  })
})

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`)
      console.info('Database URL:', DATABASE_URL)
    })
    .on('error', err => {
      console.error('Express failed to start')
      console.error(err)
    })
}

if (require.main === module) {
  runServer()
}

module.exports = { app }
