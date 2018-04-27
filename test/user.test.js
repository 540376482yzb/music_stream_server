require('dotenv').config()
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSpies = require('chai-spies')
const { TEST_DATABASE_URL } = require('../config')
const { dbConnect, dbDisconnect } = require('../db-mongoose')
const mongoose = require('mongoose')
const { app } = require('../index.js')
const User = require('../models/user')
process.env.NODE_ENV = 'test'
const expect = chai.expect
chai.use(chaiHttp)
chai.use(chaiSpies)

describe('authentication', function() {
  it('should work', function() {
    expect(true).to.be.true
  })
})
describe('authentication', function() {
  let token
  before(function() {
    return dbConnect(TEST_DATABASE_URL).then(() => mongoose.connection.db.dropDatabase())
  })

  beforeEach(function() {
    // const user = {
    // 	firstname: 'zhou',
    // 	username: 'zhensd123',
    // 	password: 'zhensd123'
    // }
    // return User.hashPassword(user.password).then(digest => {
    // 	return User.create({ local: { ...user, password: digest } })
    // })
  })

  after(function() {
    return mongoose.disconnect()
  })

  afterEach(function() {
    return User.remove()
  })

  describe('user handle', function() {
    it('should create new user', function() {
      const newUser = {
        firstname: 'zhou',
        username: 'zhensd1234',
        password: 'zhensd1234'
      }
      return chai
        .request(app)
        .post('/signup/local')
        .send(newUser)
        .then(res => {
          expect(res.body.username).to.equal(newUser.username)
          expect(res.body.password).to.be.undefined
        })
    })
    it('should not create duplicate user', function() {
      const newUser = {
        firstname: 'zhou',
        username: 'zhensd123',
        password: 'zhensd123'
      }
      return chai
        .request(app)
        .post('/signup/local')
        .send(newUser)
        .then(res => {
          expect(res).to.not.exist
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err
          }
          const res = err.response
          expect(res.body.message).to.equal('The username already exists')
        })
    })
  })
})
