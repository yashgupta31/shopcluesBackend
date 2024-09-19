const express = require('express')
const ProductModel = require('../models/product.model');
const auth = require('../middleware/auth.middleware');

const productRouter = express.Router();

// Route for create product
productRouter.post('/create', auth, async (req, res) => {
    const { name, type, brand, image, price, oldPrice, rating } = req.body;

    try {
        const product = new ProductModel({ name, type, brand, image, price, oldPrice, rating })
        await product.save();
        res.status(200).send({ "message": 'Product listed successfull' })
    } catch (error) {
        res.status(404).send({ "message": `Product listed failed - ${error}` })
    }
})

// get all products
productRouter.get('/getall', async(req, res)=>{
    try {
        const products= await ProductModel.find();
        res.status(200).json(products)
    } catch (error) {
        res.status(500).send({"message": `Internal server error- ${error}`})
    }
})

// get all products of a particular type (as per params)
// productRouter.get('/getall/:type/:brand', async(req, res)=>{

//     try {
//         const productType= req.params.type;
   
//      const result = await ProductModel.aggregate([
//         { $match: { type: productType, brand: 'poco'  }}, // Filter by product type
//         {
//             $facet: {
//                 products: [{ $match: { type: productType } }], // Get all products of the type
//                 brands: [{ $group: { _id: '$brand' } }], // Get distinct brands
//             }
//         }
//     ]);

//     // Extract products and brands from result
//     const products = result[0].products;
//     const brands = result[0].brands.map(item => item._id);
//     res.status(200).json({products, brands})
//     } catch (error) {
//         res.status(500).send(`Internal server error- ${error}`)
//     }
// })


productRouter.get('/getall/:type', async (req, res) => {
    try {
      const productType = req.params.type;
      const productBrand = req.query.brand;
      const productRating = req.query.rating;
      const page= req.query.page;
      const limit= 8;
      const skip= (page-1)*limit;
      
  
      // Build the filter object dynamically
      let filter = { type: productType };
      
      // Only add brand to the filter if it's not an empty string
      if (productBrand !== 'all') {
        filter.brand = productBrand;
      }
      if (productRating !== 'all') {
        filter.rating = { $gte: productRating };
      }
  
      // Find products based on the filter
      const products = await ProductModel.find(filter).skip(skip).limit(limit);
      const pageCount= await ProductModel.countDocuments(filter)/limit
  
      // Get distinct brands based on product type (brand is not considered here)
      const brands = await ProductModel.distinct('brand', { type: productType });
  
      // Send products and brands as the response
      res.status(200).json({products, pageCount: Math.ceil(pageCount), brands});
    } catch (error) {
      res.status(500).send(`Internal server error: ${error}`);
    }
  });
  

//route for single page
productRouter.get('/getsingle/:id', async(req, res)=>{
    try {
        const productId= req.params.id;
        const product= await ProductModel.findOne({_id: productId})
        res.status(200).json(product)
    } catch (error) {
        res.status(500).send(`Internal server error- ${error}`)
    }
})



// productRouter.get('/getbrands/:type', async(req,res)=>{
//     try {
//         const productType= req.params.type;
//         const products= await ProductModel.find({type: type})
//         res.status(200).send(products)
//     } catch (error) {
//         res.status(500).send(`Internal server error- ${error}`)
//     }
// })


module.exports = productRouter;