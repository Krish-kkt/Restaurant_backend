const cookieParser =function (req){

    if(!req.headers.cookie) return null;

    const rawCookies = req.headers.cookie.split('; ');
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

    const parsedCookies = {};
    rawCookies.forEach(rawCookie=>{
        const parsedCookie = rawCookie.split('=');
        // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
         parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
 return parsedCookies;
}


module.exports=cookieParser;