const Payment = require("../models/payment")
const uuid = require("uuid")
const jwt = require("jsonwebtoken")
const { makeDonation } = require("./DonationController")
const User = require("../models/User")
const Animal = require("../models/Animal")
const Donation = require("../models/Donations")
const { makeAdoption } = require("./AdoptController")
const { rehomePet } = require("./RehomeController")
const dotenv = require("dotenv").config()


const payment_init_handler = {
    adoption: async (user_id, rehome_animal) => {
        try {
            const animal = await Animal.findById(rehome_animal.id, "owner")
            if (!animal) {
                return { 
                    isDuplicate: true, 
                    message: "Animal not found!" 
                }
            }
            if (animal.owner.toString() === user_id) {
                return { isDuplicate: true,
                     message: "Cannot adopt your own pets!" 
                    }
            }
            return { isDuplicate: false }
        } catch (error) {
            console.error("Error in adoption duplication check:", error)
            return { 
                isDuplicate: true, 
                message: "Error during adoption validation." 
            }
        }
    },
    rehome: async (user_id, rehome_animal) => {
        try {
            const user = await User.findById(user_id)
            .populate("rehomedAnimals", "name age species")
            if (!user) {
                return { 
                    isDuplicate: true, 
                    message: "User not found!" 
                }
            }

            const isDuplicate = user.rehomedAnimals.some((animal) =>
            animal.name == rehome_animal.name & 
            animal.age == rehome_animal.age & 
            animal.species == rehome_animal.species
            )

            if (isDuplicate) {
                return { 
                    isDuplicate: true, 
                    message: "Cannot rehome your pets more than once!" 
                }
            }

            return { isDuplicate: false }
        } catch (error) {
            console.error("Error in rehome duplication check:", error)
            return { 
                isDuplicate: true,
                 message: "Error during rehome validation." }
        }
    },
};
exports.paymentInitiation = async (req, res) => {
    const user_id = req.token.payload
    const {product_type, product_id, price, product_data} = req.body
    try {
        if (product_type == "rehome" || product_type == "adoption"){
            const checkDuplication = payment_init_handler[product_type]
            if (!checkDuplication) {
                return res.status(400).json({ message: "Invalid product type!" })
            }

            const duplicate = await checkDuplication(user_id, {
                id: product_id,
                name: product_data?.name,
                age: product_data?.age,
                species : product_data?.species
            });

            if (duplicate.isDuplicate) {
                return res.status(400).json({ message: duplicate.message })
            }
        }

    const newPayment = new Payment({
            payId : uuid.v4(),
            productType : product_type,
            productId : product_id,
            productDetails : product_data,
            payee : user_id,
            price : price,
    })
    await newPayment.save()

    const signed_id = jwt.sign(newPayment.payId, process.env.JWT_PAY_KEY)

    res.status(200).send({
        message: "Payment initialised!" ,
        redirectTo :`/payment/${signed_id}`
    })
    } catch (error) {
        res.status(500).json({
            message : "An error has occured please try again later!"
        })
    }
}

const success_message_handler = {
    adoption : async (id) =>{
        const animal = await Animal.findById(id, "name")
        return `Thank you for starting the process of adopting ${animal.name}! Now its time to start buying the toys!`
    },
    donation : async (id) =>{
        const donation = await Donation.findById(id)
        return `We appreciate your donation towards ${donation.name}`
    },
    rehome : async (id)=>{
        return "Thank your for using FOR ANIMALS to rehome your pet"
    }
}


exports.renderSuccessPage = async (req, res) => {
    
    const signed_id = req.params.id

    const verified_id = jwt.verify(signed_id, process.env.JWT_PAY_KEY)

    const payment = await Payment.findOne({payId : verified_id}, "productType productId payee")

    const getMessage = success_message_handler[payment.productType]

    const message = await getMessage(payment.productId || null)

    const user = await User.findById(payment.payee, "lastname firstname")

    res.render("successPage", {user, message})

}

const product_dispaly_handler = {
    adoption : async (animal_id) => {
        const animal = await Animal.findById(animal_id, "name")
        return {type : "Adoption", name : animal.name}
    },
    donation : async (donation_id) => {
        const donation = await Donation.findById(donation_id, "name")
        return {type : "Donation", name : donation.name}
    }
}

exports.renderPaymentPage = async (req, res) => {

    const user_id = req.token.payload

    const signed_payment_id = req.params.id

    try {
        const user = await User.findById(user_id, "username")
        const verified_id = jwt.verify(signed_payment_id, process.env.JWT_PAY_KEY)
        const payment = await Payment.findOne({payId : verified_id})
        let product

        if (payment.productDetails){
            product = {type : "Rehome", name : payment.productDetails.name}
        }else{
            const getProduct = product_dispaly_handler[payment.productType]
            product = await getProduct(payment.productId)
        }

        const payment_render = {
            username : user.username,
            date : payment.date,
            id : payment.id,
            product : product,
            price : payment.price,
            hashedId : signed_payment_id
        }


        res.render("payment", {payment : payment_render})

    } catch (error) {
        res.redirect("/fallback")
    }
}

const product_payment_handler = {
    adoption : async (user_id, animal_id, amount) => {
       return await makeAdoption(user_id, animal_id)
    },
    donation : async (user_id, donation_id, amount) => {
        await makeDonation(user_id, donation_id, amount)
    },
    rehome : async (user_id, id, amount, details) => {
        return await rehomePet(user_id, details)
    }
}


exports.confirmPayment = async (req, res) => {

    const user_id = req.token.payload
    
    const signed_payment_id = req.params.id

    try {
        const verified_id = jwt.verify(
            signed_payment_id, 
            process.env.JWT_PAY_KEY
        )

        const payment = await Payment.findOneAndUpdate(
            {payId : verified_id}, 
            {progress : "Done", productDetails : null},
        )

        if (!payment) {
            return res.status(404).json({
                 message: "Payment not found." 
                })
        }

        const update = product_payment_handler[payment.productType]

        if (!update) {
            return res.status(400).json({ 
                message: "Invalid product type for payment." 
            })
        }

        const {id, success, message} = await update(
            user_id, 
            payment.productId, 
            payment.price, 
            payment.productDetails)
        
        if (!success) {
            return res.status(500).json({ message: message || "Update failed." })
        }


        if (id){
            res.status(200).send({
                redirectTo : `/payment/success/${signed_payment_id}?id=${id}`
            })
            payment.productId = id
            await payment.save()
        }else{
            res.status(200).send({
                redirectTo : `/payment/success/${signed_payment_id}`
            })
        }
    } catch (error) {
        console.log("Error : ", error)
        res.status(500).json(
            {message : "An error occurred while processing your payment"
                + "Please try again later."}
        )
    }

    
    
 }