const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const session = require("express-session")
const http = require("http").createServer(app)
const mainRouter = require("./routes/mainRouter")
require("dotenv").config();



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://extraordinary-biscotti-befba4.netlify.app");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true)

   if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next()
})

http.listen(process.env.PORT || 4000, () => {
    console.log("You are connected")
});


require("./modules/sockets")(http)

mongoose.connect(process.env.MONGO_KEY, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
},)
.then(res => {
    console.log("connection succesful")

}).catch(e => {
    console.log(e)
})


app.use(express.json())

// app.use(cors({
//     origin: true,
//     credentials: true,
//     methods: "GET, POST"
// }))

app.use(session({
    secret: "sdvsvsdvsdv",
    resave: false,
    saveUninitialized: true
}))



app.use("/", mainRouter)