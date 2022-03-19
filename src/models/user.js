const bcryptjs = require('bcryptjs');
const mongoose= require('mongoose');
const jwt = requirie('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type:String,
        required: true,
        minlength: 7,
    },
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

    delete userObject.password;
    delete userObject.tokens;

    return userObject;

}

userSchema.methods.generateAuthToken = async function(){
    const user=this;
    const token= jwt.sign({_id: user._id.toString()}, process.env.JWT_KEY , {expiresIn: '7d'});

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;

}



userSchema.statics.findByCredential = async (email, password)=>{
    const user= await User.findOne({email});

    if(!user){
        throw new Error('Unabe to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login!');
    }

    return user;


}

userSchema.pre('save', async function (next){                                             //should be standard function
    const user= this;                                                               //should be configured before using in mongoose.model
    console.log('Just before saving!');

    if(user.isModified('password')) {                                               //will only be executed for new user or password update 
        user.password = await bcrypt.hash(user.password,8);
        //console.log(user);
    }

    next();

})


const User= mongoose.model('User', userSchema);



module.exports=User;
