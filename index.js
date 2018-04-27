'use strict'

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
// const bodyParser = require('body-parser')
const passport = require('passport')
const localStrategy = require('./passport/local')
const jwtStrategy = require('./passport/jwt')

const { DATABASE_URL, PORT, CLIENT_ORIGIN } = require('./config')
const { dbConnect } = require('./db-mongoose')
const app = express()

const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const questionsRouter = require('./routes/questions')
const musicRouter = require('./routers/music')

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
)

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)

app.use(express.json())

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use('/signup', usersRouter)
app.use('/auth', authRouter)
app.use('/music', musicRouter)

passport.use(localStrategy)
passport.use(jwtStrategy)

app.use(passport.authenticate('jwt', { session: false, failWithError: true })) // protected endpoints below!
app.use('/simlish', questionsRouter)

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
  dbConnect()
  runServer()
}

module.exports = { app }
