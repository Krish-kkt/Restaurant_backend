const mongoose= require('mongoose');

const orderSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    status:{
        type: String,
    },
    date:{
        type: String,
    },
    orders:[{
        item:{
            type:String,
        },
        price:{
            type:Number,
        },
        quantity:{
            type:Number,
        }
    }]
},{
    timestamps: true,
})

const Order= mongoose.model('Order', orderSchema);

module.exports=Order;