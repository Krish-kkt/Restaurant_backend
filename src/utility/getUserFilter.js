const Menu =  require('../models/menu');

const getUserFilter= async (user)=>{

    const indexToDelete=[];
    let cartItems= await Promise.all(user.cart.map(async (cartItem, index)=>{

        const menu=await Menu.findById(cartItem.item);

        if(!menu || cartItem.cnt<1){
            indexToDelete.push(index);
            return;
        }

        // console.log(menu);

        return ({
            _id: cartItem.item,
            title: menu.title,
            price: menu.price,
            cnt: cartItem.cnt
        })
    }));

    if(indexToDelete.length!==0){
        const filteredCart= user.cart.filter((cartItem, index)=> !(indexToDelete.includes(index)));
        user.cart= filteredCart;
        await user.save();
    }

    cartItems= cartItems.filter((cartItem)=> cartItem);
    // user.cart=cartItems;
    
    let formattedUser = {
        _id: user._id.toString(),
        mail: user.mail,
        cart: cartItems
    }
    
    // console.log(formattedUser);
    

    return formattedUser;

    
}

module.exports= getUserFilter;