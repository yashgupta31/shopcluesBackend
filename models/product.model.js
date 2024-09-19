const mongoose= require('mongoose');

const productSchema= mongoose.Schema({
    name: {type: String, require: true},
    type: {type: String, require: true},
    brand: {type: String, require: true},
    image: {type: String, require: true},
    price: {type: Number, require: true},
    oldPrice: {type: Number, require: true},
    rating: { type: Number},
    discount: { type: Number },
    moreImg: {type: [String], default: []}
}, 
{ versionKey: false })

// Pre-save middleware to set random rating
productSchema.pre('save', function (next) {
    if (this.isNew) { // This check ensures the random rating is only set for new documents
        this.rating = Math.floor(Math.random() * 5) + 1;
    }

     // Calculate discount based on price and oldPrice
     if (this.oldPrice > this.price) {
        this.discount = Math.floor(((this.oldPrice - this.price) / this.oldPrice) * 100);
    } else {
        this.discount = 0;
    }

    next();
});

const ProductModel= mongoose.model('product', productSchema)

module.exports= ProductModel;