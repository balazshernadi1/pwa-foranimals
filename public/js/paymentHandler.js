const pay_btn = document.getElementById("pay-btn")
const spinnerOverlay = document.getElementById("spinner-overlay");
const paymentHeader = document.getElementById("pay-header");

pay_btn.addEventListener("click", ()=>{

    spinnerOverlay.classList.remove("hidden")
    
    setTimeout(()=>{
        spinnerOverlay.classList.add("hidden")
        confirmPayment()
    }, 3000)
})

async function confirmPayment(){

    const pay_id = document.getElementById('pay-header').dataset.paymentId

    try {
        const response  = await fetch(`/payment/${pay_id}/confirm-payment`)

        const data = await response.json()

        if (!response.ok){
            return alert(`Error has occured : ${data.message || "unknow error"}`)
        }

        alert("Payment successfull\nPayment ID: " + paymentHeader.dataset.paymentId)
        window.location.href = data.redirectTo
    }catch (error) {
        console.log("Error :", error)
        alert("Failed to confirm payment, please try again later!")
    }
} 

    
