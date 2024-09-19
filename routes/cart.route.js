const express= require('express');
const auth = require('../middleware/auth.middleware');
const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model')

const cartRouter= express.Router()

cartRouter.get('/', (req, res)=>{
    
    res.send('cart home')
})

// cartRouter.post('/addtocart',auth, async(req, res)=>{
//     const {userId, productId, quantity}= req.body;
//   try {
//     const cart= new CartModel({userId, productId, quantity});
//     await cart.save()
//   res.status(200).json({ message: 'Product added to cart' });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Internal Server Error' })
//   }
// })

cartRouter.post('/addtocart', auth, async(req, res)=>{
  const {userId, productId}= req.body;

  const cartItem= await CartModel.findOne({userId, productId});

  try {
    if(cartItem){
      res.status(200).json({message: 'Item Already added in cart', alreadyInCart: true})
    }else{
      const newCartItem= new CartModel({userId, productId, quantity: 1})
      await newCartItem.save()
      res.status(200).json({message: 'Item added to cart', alreadyInCart: false})
    }
  } catch (error) {
    res.json({message: 'Internal Server Error'})
  }
})

cartRouter.get('/getcart', auth, async(req, res)=>{
  const {userId}= req.body;

  try {
    // Log the userId to ensure it's being set
    console.log(`Fetching cart for user: ${userId}`);

    const cartItems = await CartModel.find({ userId }).populate('productId');

    // Log the cartItems to see what is returned before sending the response
    console.log('Cart items:', cartItems);

    if (!cartItems) {
      return res.status(404).json({ message: 'No items found in cart' });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  // try {
  //   const cart= await CartModel.find({userId}).populate('productId');
  //   res.status(200).json(cart)
  // } catch (error) {
  //   res.status(500).json({ message: 'Internal Server Error' })
  // }
})

cartRouter.delete('/removeItem/:productId', auth, async(req, res)=>{
  const {productId}= req.params;
  const {userId}= req.body;
  try {
    const removeItem= await CartModel.findOneAndDelete({productId, userId})
    res.status(200).json({ message: 'Item removed from cart' });
  
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// cartRouter.patch('/updateQuantity', async(req, res)=>{
//   let {productId, quantity, userId}= req.body;
//   try {
//     // let updateItem= await CartModel.findOneAndUpdate(
//     //   {productId, userId},{$set: {quantity}}, { new: true })
//     //   res.status(200).json({"message": "quantity updated successfully"})
//     const updatedCart = await CartModel.findOneAndUpdate(
//       { userId, productId },
//       { $set: { quantity } },
//       { new: true } // Return the updated document
//     );
//     console.log(updatedCart)
//     // res.status(200).json({"message": "quantity updated successfully"})

//     if (updatedCart) {
//       console.log('Updated Cart:', updatedCart);
//       res.status(200).json({ message: 'Quantity updated successfully', updatedCart });
//     } else {
//       // If no document was found for the given userId and productId
//       res.status(404).json({ message: 'Item not found in cart' });
//     }
//   } catch (error) {
//     res.status(500).json({message: 'Internal server error'})
//   }
// })




cartRouter.patch('/updateQuantity', auth, async (req, res) => {
  const { productId, userId, quantity } = req.body;
  // const { productId } = req.query; // Use query parameters

  try {
    // Find the item in the cart
    // const objectIdProductId = mongoose.Types.ObjectId(productId);
    const cartItem = await CartModel.findOne({ userId, productId });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // res.send({"message":'item found', "cartItem":cartItem})

    // Update the quantity
    cartItem.quantity = quantity;
    const updatedCartItem = await cartItem.save();

    res.status(200).json({
      message: 'Quantity updated successfully',
      updatedCartItem,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports= cartRouter;