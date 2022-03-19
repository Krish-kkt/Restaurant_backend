const cookieParser = require('./cookieParser')

const tokenParser = (req)=>{
    // const token = req.header('Authorization').replace('Bearer ', '');
    // return token;


    const cookies= cookieParser(req);
    if(!cookies) return null;
    const token=cookies.user_session_id;
    return token;
}

module.exports= tokenParser;