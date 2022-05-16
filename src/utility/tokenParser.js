const cookieParser = require('./cookieParser')

const loginTokenParser = (req)=>{
    // const token = req.header('Authorization').replace('Bearer ', '');
    // return token;


    const cookies= cookieParser(req);
    if(!cookies) return null;
    const token=cookies.user_session_id;
    return token;
}

const otpTokenParser = (req)=>{

    const cookies= cookieParser(req);
    if(!cookies) return null;
    const token=cookies.otp_token;
    return token;
}



module.exports= {
    loginTokenParser,
    otpTokenParser
}