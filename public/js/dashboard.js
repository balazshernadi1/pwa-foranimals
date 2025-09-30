const cancel_adopt_buttons = document.getElementById("adopt-container").querySelectorAll(".cancel-btn")
cancel_adopt_buttons.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        unAdopt(btn.dataset.animalId)
    })
})

const finalise_adopt_buttons = document.getElementById("adopt-container").querySelectorAll(".finalise-btn")
finalise_adopt_buttons.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        finaliseAdoption(btn.dataset.animalId)
    })
})

const remove_from_site_buttons = document.getElementById("rehome-container").querySelectorAll(".remove-from-site-btn")
remove_from_site_buttons.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        unRehome(btn.dataset.animalId)
        console.log("Hello")
    })
})

async function unRehome(id) {
    try {
        
        const response = await fetch("/account/take-off-site", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({unRehomeAnimalId : id})
        })

        const data = await response.json()

        if (!response.ok){
            if (response.status === 403){
                const warning_pop_up = document.getElementById("warning-pop-up")
                warning_pop_up.querySelector("p").textContent = data.message
                warning_pop_up.classList.remove("hidden")
                warning_pop_up.classList.remove("motion-opacity-out-0")
                warning_pop_up.classList.add("motion-opacity-in-0")
                setTimeout(()=>{
                    warning_pop_up.classList.remove("motion-opacity-in-0")
                    warning_pop_up.classList.add("motion-opacity-out-0")
                    warning_pop_up.classList.add("hidden")
                }, 4000)
                return
            }
            return alert(data.message)
        }

        removeElement(id, data.message)

    } catch (error) {
        alert("Unexpected error has occured")
    }
}

async function finaliseAdoption(id) {
    const spinner_overlay = document.getElementById("spinner-overlay")
    spinner_overlay.classList.remove("hidden")
    try {
        const response = await fetch("/account/finalise-adoption", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({adoptAnimalId : id})
        })

        const data = await response.json()

        if (!response.ok){
            return alert(data.message)
        }

        setTimeout(()=>{
            spinner_overlay.classList.add("hidden")
        }, 3000)

        removeElement(id, data.message)

    } catch (error) {
        alert("Unexpected error has occured")
    }
}

async function unAdopt(id) {
    try {
        const response = await fetch("/account/un-adopt", {
            method : "DELETE",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({unAdoptAnimalId: id})
        })

        const data = await response.json()

        if (!response.ok){
            return alert(data.message)
        }

        removeElement(id, data.message)

    } catch (error) {
        alert("Unexpected error has occured!", error)
    }
}


function removeElement(id, message){
    const element = document.getElementById(`container-${id}`)
    element.classList.add("motion-opacity-out-0")

    element.innerHTML = `<p class="motion-preset-pop text-center text-green-600 font-bold">${message}</p>`

    element.classList.replace("motion-opacity-out-0", "motion-opacity-in-0")

    setTimeout(()=>{
        element.classList.replace("motion-opacity-in-0", "motion-opacity-out-0")
    }, 3000)
    element.remove()
}


function cancelProcess() {
    alert("Cancel process triggered!");
}