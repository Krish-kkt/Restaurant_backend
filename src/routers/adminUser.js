const express = require('express');
const AdminUser = require('../models/adminUser');
const authAdmin = require('../middleware/authAdmin')


const router = new express.Router();

router.get('/admin', authAdmin.auth0, async (req, res)=>{
    try{
        const users= await AdminUser.find();
        res.status(200).send({users});
    }catch(e){
        return res.status(500).send({Error: 'Unable to fetch user right now!'});
    }
    
} )

router.get('/admin/live', authAdmin.auth, (req,res)=>{
    res.status(200).send({userType: req.user.adminType});
})

router.post('/admin', async (req, res)=>{

    // {
    //     "name":"",
    //     "mail":"",
    //     "userCode":"",
    //     "password":"",
    //     "adminType":""
    // }

    

    try{
        const user = new AdminUser({...req.body});
        await user.save();
        res.status(201).send({Msg: 'Created successfully'});
    }catch(e){
        console.log(e);
        res.status(400).send({Error: 'Unable to create user'});
    }
})

router.post('/login/admin', async (req,res)=>{
    // {
    //     "userCode":"",
    //     "password":""
    // }

    try{
        const user= await AdminUser.findByCredential(req.body.userCode, req.body.password);
        const token= await user.generateAuthToken();

        res.cookie('user_session_id', token, { maxAge: 604800000, httpOnly: true });
        res.status(200).send({userType: user.adminType});
    }catch(e){
        if(e.message==='Authentication failed!') return res.status(401).send({Error: 'Authentication failed.'});
        return res.status(500).send({Error: 'Server down! Try after sometimes.'})
        
    }
})

router.post('/logout/admin', authAdmin.auth, async (req,res)=>{
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

router.post('/logoutall/admin', authAdmin.auth, async (req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.status(200).send({Msg: 'Logout successfuly from all devices!'})

    }catch(e){

        res.status(500).send({Error: 'Server error. Unable to logout!'});
    }
})

router.delete('/admin/:id', authAdmin.auth0, async (req, res)=>{
    if(req.user._id.toString()===req.params.id) return res.status(401).send({Error: 'Invalid request!'});

    try{
        const user= await AdminUser.findOneAndDelete({_id: req.params.id});

        if(!user) return res.status(404).send({Error: 'No such user exist please refresh to see updated user list.'});

        res.status(201).send({Msg: 'User successfully deleted!'});
    }catch(e){
        res.status(500).send({Msg: "Server issue, unable to delete user. Try after sometime!"});
    }
})




module.exports= router;