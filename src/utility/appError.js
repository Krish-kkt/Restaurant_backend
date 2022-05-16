const appError = (errCode, res)=>{
    switch(errCode){
        case 500:
            res.status(500).send({Error: 'Server down! Try after sometimes.'});
            break;

        case 1400:
            res.status(400).send({Error: 'Unable to send OTP. Try again!'});
            break;
    }
}

module.exports= appError;