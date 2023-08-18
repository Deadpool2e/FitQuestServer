require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const cookieParser= require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(require('./routers/auth'))

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})