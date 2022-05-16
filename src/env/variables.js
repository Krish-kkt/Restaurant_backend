// localhost

// module.exports={
//     cookieOption: {
//          maxAge: 604800000, httpOnly: true
//     },

//     otpCookieOption: {
//         maxAge: 120000,httpOnly: true
//     }
// }

// production

module.exports={
    cookieOption: {
         maxAge: 604800000, httpOnly: true, sameSite: 'none' , secure: true
    },

    otpCookieOption: {
        maxAge: 120000, httpOnly: true, sameSite: 'none' , secure: true
   }

}