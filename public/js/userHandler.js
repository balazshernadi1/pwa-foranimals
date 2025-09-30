document.getElementById('pass').addEventListener('focusout', ()=>{
    const confirmPasswordContainer = document.getElementById('pass-conf')
    const passwordInput = document.getElementById('pass').value
    const criteriaContainer = document.getElementById('criteria')
    const matchCriteriaContainer = document.getElementById('matchCriteria')
    const req_pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if(req_pattern.test(passwordInput)){
        confirmPasswordContainer.removeAttribute('disabled')
        
        matchCriteriaContainer.classList.remove('hidden')
        matchCriteriaContainer.classList.add('flex')
    }else{
        confirmPasswordContainer.setAttribute('disabled', true)
        confirmPasswordContainer.value = ""
        matchCriteriaContainer.classList.remove('flex')
        matchCriteriaContainer.classList.add('hidden')
    }
        
    if(passwordInput){
        return
    }else{
        criteriaContainer.classList.add('hidden')
    }
})


document.getElementById('pass-conf').addEventListener('input', (event)=>{
    const passwordInput = document.getElementById('pass').value
    const confirmPassInput = event.target.value
    const confirmPassField = document.getElementById('pass-conf');
    const passwordMatch = confirmPassInput === passwordInput

    if(passwordMatch){
        confirmPassField.setCustomValidity("")
    }else{
        confirmPassField.setCustomValidity("}")
    }

    updatePasswordCriteria('matchCriteria', passwordMatch)
})


document.getElementById('pass').addEventListener('input', (event)=>{
    const criteriaContainer = document.getElementById('criteria')
    criteriaContainer.classList.remove('hidden')

    const password = event.target.value
    
    const criteria = {
        length : /.{8,}/,
        uppercase : /[A-Z]/,
        lowercase : /[a-z]/,
        number : /\d/,
        special : /[^A-z\s\d][\\\^]?/
    }

    updatePasswordCriteria('lengthCriteria', criteria.length.test(password))
    updatePasswordCriteria('numberCriteria', criteria.number.test(password))
    updatePasswordCriteria('lowercaseCriteria', criteria.lowercase.test(password))
    updatePasswordCriteria('uppercaseCriteria', criteria.uppercase.test(password))
    updatePasswordCriteria('specialCriteria', criteria.special.test(password))
})

function updatePasswordCriteria(id, isValid){
    const criteriaElement = document.getElementById(id)
    const criteriaText = criteriaElement.querySelector("span")
    const criteriaMark = criteriaElement.querySelector("svg")

    if(isValid){
        criteriaText.classList.replace("text-red-600","text-green-600")
        criteriaMark.classList.replace("fill-red-100", "fill-lime-200")
        criteriaMark.classList.replace("stroke-red-500", "stroke-lime-500")
    }else{
        criteriaText.classList.replace("text-green-600","text-red-600")
        criteriaMark.classList.replace("fill-lime-200", "fill-red-100")
        criteriaMark.classList.replace("stroke-lime-500", "stroke-red-500")        
    }
}


document.addEventListener('DOMContentLoaded', ()=>{

    const form = document.getElementById('registerForm')
    
    form.addEventListener('submit', (event)=>{
        event.preventDefault()
        submitRegisterForm()
    })
})



async function registerNewUser(username, password) {
    try{
        const response = await fetch("/register/newUser", {
            method : "POST",
            headers : {
                'Content-Type' : "application/json"
            },
            body : JSON.stringify({username : username, password : password})
        })

        if(!response.ok){
            console.log("Error")
        }

        const data = await response.json()

        if(data.success){
            console.log("User created")
            window.location.href = data.redirectTo
        }else{
            console.log("Error creating user")
        }


    }catch(error){
        console.log(error.message)
    }
}

async function submitRegisterForm() {
    
    const username = document.getElementById('usern').value
    const password = document.getElementById('pass').value
    const password_conf = document.getElementById('pass-conf').value

    if ((username || password || password_conf) == ""){
        return displayMessage("Please fill in all fields")
    }else if(password !== password_conf){
        return displayMessage("Passwords don't match")
    }

    try{
        const response = await fetch("/register/checkUser", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({username : username})
        })

        const data = await response.json()

        if(!response.ok){
            return handleRegisterError(response.status, data.message)
        }

        if (data.exists) {
            handleRegisterError()
        } else {
            console.log("SUCCESS: " + data.message)
            registerNewUser(username, password)
        }

    }catch(error){
        console.log(error)
    }
}

function handleRegisterError(status, message){

    switch(status){
        case 404 : displayMessage(message)
    }

}

function displayMessage(message){
    const register_feedback = document.getElementById("register-feedback")

    register_feedback.classList.remove("hidden")
    register_feedback.classList.remove("motion-opacity-out-0")

    if  (register_feedback.textContent != message){
        register_feedback.textContent = message
    }

    setTimeout(()=>{
        login_feedback.classList.add("motion-opacity-out-0")
    }, 3000)
}
