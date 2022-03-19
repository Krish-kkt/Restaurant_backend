const bcrypt = require('bcryptjs');
const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');


const adminUserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    mail:{
        type:String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
    },
    userCode:{
        type: String,
        unique: true,
        trim: true,
        uppercase: true,
    },
    password:{
        type:String,
        required: true,
        minlength: 7,
    },
    adminType:{
        type:String,
        required: true,
        uppercase: true,
    },
    tokens:[{
        token:{
            type: String,
        }
    }]
},{
    timestamps: true,
});



adminUserSchema.methods.generateAuthToken = async function(){
    const user=this;
    const token= jwt.sign({_id: user._id.toString()}, process.env.JWT_KEY , {expiresIn: '7d'});

    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;

}



adminUserSchema.statics.findByCredential = async (userCode, password)=>{
    
    let user;
    try{
        user= await AdminUser.findOne({userCode: userCode.toUpperCase()});
    }catch(e){
        throw new Error('Server Error!');
    }
    if(!user){
        throw new Error('Authentication failed!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Authentication failed!');
    }
    

    return user;


}

adminUserSchema.pre('save', async function (next){                                             //should be standard function
    const user= this;                                                               //should be configured before using in mongoose.model
    console.log('Just before saving!');

    if(user.isModified('password')) {                                               //will only be executed for new user or password update 
        user.password = await bcrypt.hash(user.password,8);
        //console.log(user);
    }

    next();

})


const AdminUser= mongoose.model('AdminUser', adminUserSchema);



module.exports=AdminUser;