const express= require('express');
const port = 8008;
const app = express();
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://Madmeerkat:asdzxc456123@cluster0.k9xpb.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex:true, useFindAndModify:false
})
    .then(()=>{
        console.log("MondgoDB CONNECTED");
    })
    .catch((err)=>{
        console.error(err);
    })
app.get('/', (req,res)=>{
    res.send('Hello World');
});

app.listen(port, ()=>{
    console.log(port, "번 포트에서 대기중");
});