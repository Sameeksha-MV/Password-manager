require('dotenv').config()
const express = require('express')
const cors = require('cors')

const dbConnect = require('./config/dbConnect')
const userRoutes = require('./routes/userRoutes')
const siteRoutes = require('./routes/siteRoutes')

const app = express()
const port = process.env.PORT 
const DB_URL = process.env.DB_URL

// CORS Policy
app.use(cors())

// Database connection
dbConnect(DB_URL)

//JSON
app.use(express.json())

//Load Routes
app.use("/api/user", userRoutes)
app.use("/api/site", siteRoutes)

app.listen(port, ()=>{
    console.log(`Server is listening at ${port}`)
})