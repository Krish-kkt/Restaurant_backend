const express = require('express');
const Category= require('../models/category');
const authAdmin = require('../middleware/authAdmin');
const Menu = require('../models/menu');

const router = new express.Router();

router.get('/category',  async (req, res)=>{
    try{
        const categories= await Category.find();
        res.status(200).send(categories);
    }catch(e){
        res.status(500).send({Error: 'Server down! Try after some time.'});
    }
})

router.get('/check/category/:item', authAdmin.auth, async(req, res)=>{
    try{
        const category= await Category.findOne({title: req.params.item.toUpperCase()});
        if(category) return res.status(200).send({Msg: 'true'});

        return res.status(200).send({Msg: 'false'});
    }catch(e){
        console.log(e);
        res.status(500).send({Error: 'Unable to fetch data due to server error. Try after sometime.'});
    }
})

router.post('/category', authAdmin.auth, async (req, res)=>{

    try{
        const title= req.body.title.trim().toUpperCase();
        
        try{
            let category= await Category.findOne({title: title});
            if(category) return res.status(400).send({Error: 'Failed to create! Category already exist.'});

            category= new Category({title: title});
            await category.save();
            res.status(201).send({Msg: 'Successfully created!', Response: [category]});
        }catch(e){
            return res.status(500).send({Error: 'Server down! Try after some time.'})
        } 
    }catch(e){
        res.status(400).send('Failed to create category! Retry.');
    }
})

router.patch('/category',authAdmin.auth, async (req, res)=>{

    try{
        const allowedUpdates= ['title', '_id'];
        const updates= Object.keys(req.body);       //convert all keys in array
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

        if(!isValidOperation || req.body.title.trim()==='') return res.status(400).send({Error: 'Failed to modify! Invalid update.'});

        let category;
        let newTitle;

        try{
            category = await Category.findOne({_id: req.body._id});
            newTitle= await Category.findOne({title: req.body.title.trim().toUpperCase()});
        }catch(e){
            return res.status(500).send('Server down! Try after some time.');
        }

        if(!category) return res.status(404).send({Error: 'Category not found. Refresh to get updated category!'});
        if(newTitle) return res.status(404).send({Error: 'Failed to modify! Category already exist.'})

        try{
            updates.forEach((update) => {
                if(update!=='_id') category[update]= req.body[update].trim().toUpperCase();
                
            });

            await category.save();

            res.status(201).send({Msg: 'Successfuly modified!', Category: category});
        }catch(e){
            console.log(e);
            return res.status(500).send({Error:'Server down! Try after some time.'});
        }
    }catch(e){
        return res.status(400).send({Error: 'Failed to modify! Retry.'})
    }
})

router.delete('/category', authAdmin.auth, async(req,res)=>{
    try{
        const category=await Category.findOneAndDelete({_id: req.body._id});
        if(!category) return res.status(404).send({Error: "Category not found! Refresh to get updated list."});

        const menus= await Menu.deleteMany({categoryId: req.body._id});

        res.status(201).send({Msg: 'Deleted successfully!'});

    }catch(e){
        res.status(500).send({Error: 'Server down! Try after some time.'});
    }
})



//delete will be done after menu


module.exports= router;