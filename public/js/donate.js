document.addEventListener("DOMContentLoaded", () => {

    const campaigns = document.querySelectorAll(".campaign")

    campaigns.forEach(campaign =>{

        const campaign_id = campaign.dataset.campaignId
        const donation_input = campaign.querySelector(".donation-input")
        const warning_text = campaign.querySelector(".warning-text")
        const donation_buttons = campaign.querySelector(".donation-btns").querySelectorAll("button")
        const donate_now_btn = campaign.querySelector(".donate-now-btn")
        

        donate_now_btn.addEventListener("click", ()=> sendDonation(Number(donation_input.value), campaign_id))

        donation_buttons.forEach(button =>{
            button.addEventListener("click", () => {
                donation_buttons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'))
                button.classList.add('bg-blue-500', 'text-white')
    
                if (button.classList.contains("other-amount")) {
                    donation_input.removeAttribute("readonly")
                    donation_input.value = ""
                    donation_input.focus()
                    donate_now_btn.setAttribute("disabled", true)
                    donation_input.addEventListener("input", (event)=> filterOtherAmountInput(warning_text,event, donate_now_btn))
                } else {
                    donation_input.value = button.textContent.trim()
                    donation_input.setAttribute("readonly", true)
                    donation_input.removeEventListener("input", (event)=> filterOtherAmountInput(warning_text, event, donate_now_btn))
                    hideWarning(warning_text)
                    donate_now_btn.removeAttribute("disabled")
                }
            });

        })
    })

    

    function filterOtherAmountInput(warning_text, event, donate_now_btn) {
        const input_value = Number(event.target.value)
        if (isNaN(input_value)) {
            showWarning(warning_text,"The amount needs to be a number")
            donate_now_btn.setAttribute("disabled", true)
        } else if (input_value <= 0 || input_value > 5000) {
            showWarning(warning_text,"Donation amount has to be between 1 - 5000")
            donate_now_btn.setAttribute("disabled", true)
        } else {
            hideWarning(warning_text);
            donate_now_btn.removeAttribute("disabled")
        }
    }

    function showWarning(warning_text, message) {
        warning_text.textContent = message
        warning_text.classList.remove("hidden")
    }

    function hideWarning(warning_text) {
        warning_text.textContent = ""
        warning_text.classList.add("hidden")
    }

    async function sendDonation(amount, donation_id){

        const response = await fetch("/payment/initiate-payment", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "X-Fetch-Call" : "true"
            },
            body : JSON.stringify({product_type : "donation", product_id : donation_id, price : amount})
        })

        const data = await response.json()

        if (!response.ok){
            alert(data.message)
        }


        window.location.href = data.redirectTo
    }

});

    

