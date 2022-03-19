const Category = require('../models/category');
const Menu = require('../models/menu');

const getMenuFilter =async () =>{
    try{
        let categories= await Category.find();
        const menu= await Promise.all(categories.map(async (category)=>{
            await category.populate('menu');
            return category.menu.reverse();
        }));

        return menu;


    }catch(e){
        // res.status(500).send({Error: 'Server error. Try after sometime.'})
        console.log('hi');
        throw new Error('Server error. Try after sometime.');
    }
}

module.exports= getMenuFilter;