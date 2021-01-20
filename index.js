const express= require('express');
const port = 8008;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth.js');
const config = require('./config/key');
const {User} = require('./models/User.js');
const { mongoURI } = require('./config/dev');



// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect(mongoURI,{
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

app.post('/api/users/register', (req,res)=>{
    //회원 가입 정보들을 client에서 가져오기
    //database 에 정보들을 넣어주기
    const user = new User (req.body)

    user.save((err,userInfo)=>{
        if(err) {
            console.error(err);
            return res.json({success:false, err});
        }
        return res.status(200).json({success:true});
    });
});

app.post('/api/users/login', (req,res)=>{
     User.findOne({email: req.body.email} , (err,user)=>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message: "NO MATCHING USER"
            });
        }
        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(!isMatch){
                return res.json({loginSuccess:false, message:"WRONG PASSWORD"});
            }
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})
            })
        })
    })
});

app.get('/api/users/auth', auth, (req, res) => {
    //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    })
  })
app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id },
      { token: "" }
      , (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
      })
  })
// app.get('/api/users/logout', auth, (req,res)=>{
//     User.findOneAndUpdate({_id: req.user._id}, {token : ""}, (err,user)=>{
//         console.log('what');
//             if(err) return res.json({success:false, err});
//             return res.status(200).send({
//                 success: true
//             });
//         }
//     )
// });

app.listen(port, ()=>{
    console.log(port, "번 포트에서 대기중");
});