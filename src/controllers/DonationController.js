const Donation = require("../models/Donations")


exports.renderDonationPage = async (req,res) => {
    
    try {
        const donations = await Donation.find().limit(3)

        donations.forEach(campaign => {
            campaign.progress = ((campaign.amount/campaign.goal)*100).toString()
        });        

        res.render("donation.ejs", {donations})
    } catch (error) {
        
    }
}


exports.makeDonation = async (user_id, donation_id, amount) =>{
    try{
        if(!user_id || !amount || !donation_id || isNaN(amount)){
            return {success : false, message : "Invalid parameteres"}
        }
        await Donation.updateUserDonation(user_id, donation_id, amount)
        return {succes : true}
    }catch(error){
        return {success : false, message : "Error in updating donations"}
    }

}