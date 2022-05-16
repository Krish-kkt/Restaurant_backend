const jwt= require('jsonwebtoken');
const User = require('../models/user');

const tokenParser = require('../utility/tokenParser');

const auth = async (req, res, next)=>{

    const token= tokenParser.loginTokenParser(req);
    let decode;
    let user;

    try{
        decode= jwt.verify(token, process.env.JWT_KEY);
    }catch(e){
        return res.status(401).send({Error: 'Unauthorized! Retry after Logging In.'});
    }

    try{
        user= await User.findOne({_id: decode._id, 'tokens.token': token});

    }catch(e){
        return res.status(500).send({Error: 'Server down! Try after some time.'})
    }

    if(!user) return res.status(401).send({Error: 'Unauthorized! Retry after Logging In.'});

    // console.log(user);
    req.user=user;
    req.token=token;

    next();
    
}

module.exports= auth;