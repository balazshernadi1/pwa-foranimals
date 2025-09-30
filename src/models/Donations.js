const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    name: { type: String, required: true},
    amount: { type: Number, default: 0, min: 0 },
    goal: { type: Number, required: true, min: 1 },
    start: { type: Date, required: true },
    end: {
        type: Date,
        validate: {
            validator: function (value) {
                return !this.start || value > this.start;
            },
            message: 'End date must be after the start date.'
        }
    },
    description: { type: String },
    status: { 
        type: String, 
        enum: ["Active", "Inactive"], 
        required: true, 
        default: "Active" 
    },
    donors: [
        {
            donor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            amountDonated: {
                type: Number,
                required: true,
                min: 1,
                max: 5000
            },
            dateDonated: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

DonationSchema.statics.updateUserDonation = async function(user_id, donation_id, amountDonated){
    const campaign =  await this.findById(donation_id)
    campaign.donors.push({donor : user_id, amountDonated : amountDonated, dateDonated : new Date().now})

    console.log(campaign)

    campaign.amount += amountDonated

    campaign.save()
    return campaign
}

const Donation = new mongoose.model("Donation", DonationSchema)



module.exports = Donation