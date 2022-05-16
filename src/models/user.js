const bcryptjs = require('bcryptjs');
const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    mail:{
        type: String,
        trim: true,
        lowercase: true,
    },
    cart:[{
        item:{
            type: mongoose.Schema.Types.ObjectId,
        },
        cnt:{
            type: Number,
        }
    }],
    tokens:[{
        token:{
            type: String,
        }
    }]
},{
    timestamps: true,
});

userSchema.methods.toJSON = function (){
    const user =this;
    const userObject = user.toObject();

    
    delete userObject.tokens;
    delete userObject.createdAt;
    delete userObject.updatedAt;


    return userObject;

}

userSchema.methods.generateAuthToken = async function(){
    const user=this;
    const token= jwt.sign({_id: user._id.toString()}, process.env.JWT_KEY , {expiresIn: '7d'});

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;

}

// userSchema.pre('save', (next)=>{
//     console.log(this);
//     console.log('saved');
//     next();
// })

const User= mongoose.model('User', userSchema);



module.exports=User;
