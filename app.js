const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const session = require("express-session")
const http = require("http").createServer(app)
const mainRouter = require("./routes/mainRouter")

require("./modules/sockets")(http)

mongoose.connect("mongodb+srv://admin:admin123@cluster0.b3ygyni.mongodb.net/tinderUsers?retryWrites=true&w=majority")
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