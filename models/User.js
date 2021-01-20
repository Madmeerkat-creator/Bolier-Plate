const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique:1
    },
    password:{
        type: String,
        minlength:5
    },
    lastname: {
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default: 0
    },
    image: String,
    token : {
        type: String
    },
    tokenExp:{
        type:Number
    }
});

userSchema.pre('save', async function(next) {

    if(this.isModified('password')){
        const rounds = 10;
        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;
        next();
    }
    else{
        next();
    }
});

// userSchema.pre('save', async function(next){
//     // passowrd 암호화
//     var user = this;

//     //if(user.isModified('password')){
//         const hash = await bcrypt.hash(user.pasword, saltRounds);
//         user.password = hash;
//         console.log('change pass', user.password);
        // bcrypt.genSalt(saltRounds, function(err,salt){
        //     if(err) return next(err);
        //     bcrypt.hash(user.password, salt, function(err,hash){
        //         if(err) return next(err);
        //         console.log("first", hash);
        //         console.log("second", user.password);
        //         user.password = hash;
        //         console.log("thrid",user.password);
        //     });
        // });
        // next();
//     //}
// });

userSchema.methods.comparePassword = async function(plainPassword,cb){
    await bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err)
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    });
};

userSchema.statics.findByToken = function(token,cb){
    var user = this;
    //복호화
    jwt.verify(token,'secretToken' , function(err,decoded){
        user.findOne({"_id" : decoded, "token" : token}, function(err,user){
            if(err) return cb(err);
            cb(null,user);
        });
    });
};
const User =mongoose.model('User', userSchema);

module.exports = {User};