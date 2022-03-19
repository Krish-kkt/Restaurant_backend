const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    items:[{
        item:{
            type: mongoose.Schema.Types.ObjectId, 
        },
        quantity:{
            type: Number,
        }
    }]
},{
    timestamps: true, 
})

const Cart= mongoose.model('Cart', cartSchema);

module.exports=Cart;