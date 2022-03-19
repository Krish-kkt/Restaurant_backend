const mongoose = require('mongoose');
const Menu= require('./menu');


const categorySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    
},{
    timestamps: true,
})

categorySchema.virtual('menu',{
    ref: 'Menu',
    localField:'_id',
    foreignField: 'categoryId'
});

categorySchema.methods.toJSON = function (){
    const user =this;
    const userObject = user.toObject();

    delete userObject.updatedAt;
    delete userObject.createdAt;
    delete userObject.__v;

    return userObject;

}


const Category =mongoose.model('Category', categorySchema);

module.exports= Category;