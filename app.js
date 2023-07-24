const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const userRoutes = require('./routes/authRoutes')

const app = express()
app.use(express.json())

// Database connection
const dbuser = process.env.DB_USER
const dbpass = process.env.DB_PASS
mongoose
  .connect(
    `mongodb+srv://${dbuser}:${dbpass}@autenticacao-jwt.yn8qkrv.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000)
    console.log('Conectado com o Banco')
  })
  .catch(err => console.log(err))

// Routes
app.use('/', userRoutes)
