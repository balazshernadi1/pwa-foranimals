const mongoose = require('mongoose');
const User = require('./User');
const Donation = require('./Donations');
const Animal = require('./Animal');

const PaymentSchema = new mongoose.Schema({
    payId :{
        type : mongoose.SchemaTypes.UUID,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    },
    payee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true
    },
    productType : {
        type : String,
        enum : ["adoption", "donation", "rehome"],
        required : true
    },
    productDetails : {
        type : mongoose.Schema.Types.Mixed
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    price : {
        type : mongoose.Schema.Types.Number,
        default:0,
        min:0,
        max:300,
        required:true
    },
    progress : {
        type : String,
        enum : ["Expired", "In-Progress", "Done"],
        default : "In-Progress"
    }
})



PaymentSchema.statics.getRecentTransaction = async function(limit) {

    const product_handler = {
        adoption : async (id) => {
            const animal = await Animal.findById(id, 'name')
            return {product : animal.name, message : "Has adopted"}
        },
        donation : async (id) => {
            const donation = await Donation.findById(id, 'name')
            return {product : donation.name, message : 'Has donated towards'}
        },
        rehome : async (id) => {
            const rehome = await Animal.findById(id, 'name')
            return {product : rehome.name, message : "Has rehomed"}
            
        }
    }

    const payments = await this.find().limit(limit)
    
    const recentPurchases = await Promise.all(
        payments.map(async (payment) => {
            const user = await User.findById(payment.payee, "username")
            const getProduct = product_handler[payment.productType]
            const productInfo = await getProduct(payment.productId)
            return {
                username : user.username,
                message : productInfo.message,
                product : productInfo.product
            }
        })
    )

    return recentPurchases

    payments.forEach(async payment => {
        
    });

    return recentPurchases

}

const Payment = new mongoose.model("Payment", PaymentSchema)

module.exports = Payment