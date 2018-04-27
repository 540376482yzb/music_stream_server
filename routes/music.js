'use strict'

const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/', (req, res, next) => {
  // res.setHeader('Content-Type', 'application/audio/mpeg3')
  // res.sendFile('/musics/music.mp3', { root: 'public' })
})

module.exports = router
