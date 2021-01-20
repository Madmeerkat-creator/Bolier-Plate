const { User } = require("../models/User");

let auth = async (req,res,next)=>{
     // 클라이언트의 TOKEN을 복호화해서 서버의 DB와 비교
     //클라이언트의 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;
    //토큰 복호화 -> 유저 찾기
    await User.findByToken(token, (err,user)=>{
        if(err) throw err;
        if(!user) return res.json({isAtuh: false, error: true});
        req.token = token;
        req.user = user;
        next();
    });
  
};

module.exports = {auth};