const express= require('express');
const Menu = require('../models/menu');
const Category = require('../models/category');
const authAdmin = require('../middleware/authAdmin');
const getMenuFilter = require('../utility/getMenuFilter');

const router = new express.Router();

router.get('/menu', async (req, res)=>{
    try{
        const menu= await getMenuFilter();
        res.status(200).send(menu);


    }catch(e){
        res.status(500).send({Error: 'Server down!. Try after some time.'})
    }
})

router.post('/menu', authAdmin.auth, async(req, res)=>{     //category , title , description, price
    
    try{
        let title= req.body.title.trim().toUpperCase();
        let category=req.body.category.trim().toUpperCase();
        let description='';
        if(req.body.description)  description=req.body.description.trim();
        let price= req.body.price.trim();

        if(title==='' || price==='' || category==='') throw new Error('Field required!');
        if(Number(price)===NaN) throw new Error('Price should be number!');
        if(Number(price)<=0) throw new Error('Price should be greater than 0!');

        price= Number(price);
        price= Math.round((price + Number.EPSILON) * 100) / 100;

        try{
            category = await Category.findOne({title: category});
            if(!category) return res.status(400).send({Error: 'Failed to create! Invalid category.'});

            const temp= await Menu.findOne({title: title, categoryId: category._id});
            if(temp) return res.status(400).send({Error: 'Failed to create! Menu already exist with this title.'});

            const menu= new Menu({
                title: title,
                description: description,
                price: price,
                categoryId: category._id
            })

            await menu.save();

            res.status(201).send({Msg : 'Successfully created!', Response: menu});
        }catch(e){
            console.log(e);
            res.status(500).send({Error: 'Server down! Try after some time.'})
        }
    }catch(e){
        res.status(400).send({Error: 'Failed to create! Retry.'})
    }
})

router.patch('/menu', authAdmin.auth, async(req, res)=>{

    try{
        const allowedUpdates= ['title' ,'_id', 'description', 'price', 'categoryId'];
        const updates= Object.keys(req.body);       //convert all keys in array
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

        if(!isValidOperation) return res.status(400).send({Error: 'Invalid update!'});

        try{
            //const task= await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            const menu = await Menu.findOne({_id: req.body._id});
            
            if(!menu){
                return res.status(404).send({Error: 'Requested menu not found. Refresh to get updated list!'});
            }
            if(req.body.title){
                if(req.body.title.trim()==='') return res.status(400).send({Error: 'Title required!'});
                const temp= await Menu.findOne({title: req.body.title.trim().toUpperCase(), categoryId:req.body.categoryId});
                if(temp && req.body._id!==temp._id.toString()) return res.status(400).send({Error: 'Unable to modify! Title already exist within selected category.'});
                req.body.title=req.body.title.trim().toUpperCase();
                
            }

            if(req.body.price){
                const price= req.body.price.trim();
                if(price==='' || Number(price)===NaN || Number(price)<=0) res.status(400).send({Error: 'Invalid price!'});

                req.body.price=Number(req.body.price.trim());
                
            }

            if(req.body.description) req.body.description=req.body.description.trim();
            

            updates.forEach((update) => {
                if(update!=='_id') menu[update]= req.body[update];
                
            });

            await menu.save();

            res.status(201).send({Msg: 'Successfuly modified!', Response: menu});
        }catch(e){
            // console.log(e);
            res.status(500).send({Error : "Server down! Try after some time."});
        }
    }catch(e){
        res.status(400).send({Error: 'Failed to modify! Retry.' });
    }
})

router.delete('/menu', authAdmin.auth, async(req, res)=>{
    try{
        //const task = await Task.findByIdAndDelete(req.params.id);

        const menu= await Menu.findOneAndDelete({_id: req.body._id});

        if(!menu) return res.status(404).send({Error: "Menu not found! Refresh to get updated list."});
        res.status(201).send({Msg: 'Deleted successfully!'});
    }catch(e){
        res.status(500).send({Error: 'Server down! Try after some time.'});
    }
})



module.exports=router;