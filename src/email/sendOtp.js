const sgMail= require('@sendgrid/mail');

const sendgridApiKey =process.env.SENDGRID_API_KEY ;

sgMail.setApiKey(sendgridApiKey);

const sendOtp = async (email, otp)=>{
    return (sgMail.send({
        to: email,
        from: 'krish.20.sinha@gmail.com',
        subject: 'My cafe OTP Authentication',
        text: `OTP for login request is: ${otp} . `
    }))
};

module.exports=sendOtp;