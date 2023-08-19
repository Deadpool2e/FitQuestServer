require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const cookieParser= require("cookie-parser");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    next();
    });
app.use(cookieParser());
app.use(express.json());
app.use(require('./src/routers/auth'))

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})