const express = require('express');
const User = require('../models/user');
const authUser = require('../middleware/authUser');
const variables = require('../env/variables');
const otpGenerator= require('../utility/otpGenerator')
const jwt= require('jsonwebtoken');
const sendOtp= require('../email/sendOtp');
const tokenParser = require('../utility/tokenParser');
const getUserFilter= require('../utility/getUserFilter');
const Menu = require('../models/menu');

const router= new express.Router();

router.get('/user', authUser, async(req, res)=>{
    const user = await getUserFilter(req.user);
    res.status(200).send({user:user, newUser: false});
})


router.post('/login/user', async(req, res)=>{
    try{
        if(req.body.mail===undefined) throw new Error();
        const otp= otpGenerator();
        const key= process.env.JWT_KEY+otp;
        const otpToken= jwt.sign({mail: req.body.mail}, key , {expiresIn: 120000});

        try{
            await sendOtp(req.body.mail, otp);
        }catch(e){
            console.log(e);
            return res.status(500).send({Error: 'Server down! Try after sometimes.'});
        }
        res.cookie('otp_token', otpToken, variables.otpCookieOption);
        res.status(200).send({MSg: 'OTP sent to your mail id!'});

    }catch(e){
        return res.status(400).send({Error: 'Unable to send OTP. Try again!'});
    }

})


router.post('/authenticate/user', async (req, res)=>{
    try{
        const otpToken= tokenParser.otpTokenParser(req);
        const otp= req.body.otp;
        const key=process.env.JWT_KEY+otp;
        let decode;
        try{
            decode= jwt.verify(otpToken, key );
        }catch(e){
            // console.log(e.message);
            return res.status(400).send({Error: "Incorrect otp!"});
        }
        const mail=decode.mail;

        try{
            let user= await User.findOne({mail:mail});
            
            if(!user){
                user= new User({mail:mail});

                console.log(user);

                await user.save();
                console.log('saved');

                const token= await user.generateAuthToken();
                console.log(user);
                
                res.cookie('user_session_id', token, variables.cookieOption);
                user = await getUserFilter(user);
                res.status(200).send({user:user, newUser: true});
            }else{
                const token= await user.generateAuthToken();
                user= await getUserFilter(user);
                res.cookie('user_session_id', token, variables.cookieOption);
                res.status(200).send({user:user, newUser: false});
            }
        }catch(e){
            console.log(e);
            res.status(500).send({Error:'Server down! Try after sometimes.' });
        }
        
    }catch(e){
        res.status(400).send({Error: 'Unable to authenticate.'});
    }
})

router.post('/user/cart', authUser, async(req, res)=>{
    try{
        const cartItems= req.body.cartItems;
        // console.log(cartItems);

        let user= req.user;
        // console.log(user);
        if(cartItems.length===0){
            return res.status(400).send({Error: 'Item required!'});
        }

        let Msg=null;
        let newCartItems=[]

        for (let i=0; i<cartItems.length; i++){
            // console.log(cartItems[i]._id);
            const menu = await Menu.findById(cartItems[i]._id);

            // console.log(menu);
            
            if(!menu){
                Msg='No such item exist. Refresh to get updated menu!';
                continue;
            }

            const index= user.cart.findIndex((userCart)=> userCart.item.toString()===cartItems[i]._id);
            // console.log(index);
            if(index!==-1){
                user.cart[index].cnt+=Number(cartItems[i].cnt);
                if(user.cart[index].cnt<0) throw new Error();
            }else{
                newCartItems.push({item: cartItems[i]._id, cnt: cartItems[i].cnt});
                // console.log(newCartItems);
            }
        }



        user.cart=[...newCartItems, ...user.cart];
        // console.log(user.cart);

        await user.save();
        
        if(Msg) return res.status(404).send({Error:'Some of items do not exist. Refresh to get updated menu!'})

        return res.status(201).send({Msg: 'Cart updated successfully!'});


    }catch(e){
        console.log(e);
        return res.status(400).send({Error: 'Unable to update items to cart.'});
    }
})

router.get('/logout/user', authUser, async (req,res)=>{
    try{
        req.user.tokens= req.user.tokens.filter((currtoken)=>{
            return currtoken.token !== req.token;
        })

        await req.user.save();
        res.status(200).send({Msg: 'Logout successfuly!'})

    }catch(e){
        res.status(500).send({Error: 'Server error. Unable to logout!'});
    }
})

router.get('/logoutall/user', authUser, async (req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.status(200).send({Msg: 'Logout successfuly from all devices!'})

    }catch(e){

        res.status(500).send({Error: 'Server down! Unable to logout.'});
    }
})




module.exports=router;