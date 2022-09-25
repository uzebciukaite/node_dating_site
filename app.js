const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const session = require("express-session")
const http = require("http").createServer(app)
const mainRouter = require("./routes/mainRouter")
require("dotenv").config();

require("./modules/sockets")(http)

mongoose.connect(process.env.MONGO_KEY)
.then(res => {
    console.log("connection succesful")

}).catch(e => {
    console.log(e)
})

http.listen(4000);
app.use(express.json())

app.use(cors({
    origin: true,
    credentials: true,
    methods: "GET, POST"
}))

app.use(session({
    secret: "sdvsvsdvsdv",
    resave: false,
    saveUninitialized: true
}))



app.use("/", mainRouter)