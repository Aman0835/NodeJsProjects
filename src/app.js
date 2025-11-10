const express = require('express');
const app = express();


app.use((req,res)=>{
    res.send("hello ji ");
})

app.listen(3000, ()=>{
    console.log("the server is runnning on port 3000....");
});