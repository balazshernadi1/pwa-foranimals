const baseURL = new URL(window.location.href)
const searchParams = baseURL.searchParams

document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('detailsForm')
    form.addEventListener('submit', (event)=>{
        event.preventDefault()
        submitDetailsForm()
    })

    const skip_btn = document.getElementById('skip-btn')
    skip_btn.href = searchParams.get("skip") ? searchParams.get("skip") : "/"
})


async function submitDetailsForm() {
    const first_name = document.getElementById('first-name').value
    const last_name = document.getElementById('last-name').value
    const email = document.getElementById('email-address').value
    const phone = document.getElementById('phone-number').value
    const street = document.getElementById('street').value
    const postcode = document.getElementById('postcode').value
    const city = document.getElementById('city').value
    const county = document.getElementById('county').value

    try {
        const response = await fetch("/account/save-details", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                required : {
                    firstname : first_name,
                    lastname : last_name,
                    phone : phone,
                    email : email,
                    address : {
                        city : city,
                        street : street,
                        postcode : postcode,
                        county : "none"
                    },
                    profileCompleted : true
                },
                optional : {
                    county : county
                },
                returnTo : searchParams.get("returnTo")
            })
        })
    
        const data = await response.json()
    
        if (!response.ok){
            return displayMessage(data.message)
        }
    
        window.location.href = data.redirectTo
    } catch (error) {
        displayMessage("Unexpected error has occured, please try again later!")
    }

    
}

function displayMessage(message){
    const details_feedback = document.getElementById("details-feedback")

    details_feedback.classList.remove("hidden")
    details_feedback.classList.remove("motion-opacity-out-0")

    if (details_feedback.textContent != message){
        details_feedback.textContent = message
    }

    setTimeout(()=>{
            details_feedback.classList.add("motion-opacity-out-0")
        }, 3000)
}