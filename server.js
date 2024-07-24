const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();
const cors = require("cors");
const app = express();

const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");


mongoose.connect(process.env.DATABASE, {})
.then(()=>{
    console.log("connected")
})
.catch((error)=>{
    console.log(error)
});

app.use(bodyParser.json());
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: true}));
app.use(cors());


app.use("/api", authRoute);
app.use("/api", postRoute);

const port = process.env.PORT || 8000;




app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
});