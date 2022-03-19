const mongoose = require('mongoose');


const menuSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        uppercase:true
    },
    description:{
        type: String,
        trim: true,
        default:''
    },
    price:{
        type: Number,
        required: true,
    },
    reviewCnt:{
        type: Number,
        default: 0,
    },
    avgReview:{
        type: Number,
        default: 0,
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
},{
    timestamps: true,
})

menuSchema.methods.toJSON = function (){
    const user =this;
    const userObject = user.toObject();

    delete userObject.updatedAt;
    delete userObject.createdAt;
    delete userObject.__v;
    delete userObject.avgReview;
    delete userObject.reviewCnt;

    return userObject;

}



const Menu =mongoose.model('Menu', menuSchema);

module.exports= Menu;
