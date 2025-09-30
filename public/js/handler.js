

document.addEventListener('DOMContentLoaded', ()=>{

    const form = document.getElementById('filterForm')

    if (form){
        form.addEventListener('submit', (event)=>{
            event.preventDefault()
            applyFilters()
        })
    
    }
    
    


    const lazyImages = document.querySelectorAll('img.load-lazy')

    const observer = new IntersectionObserver((images)=>{
        images.forEach(image => {
            const img = image.target
            if (image.isIntersecting){
                img.src = img.getAttribute('data-src')
                img.addEventListener('load', ()=>{
                    img.classList.add("motion-blur-in-[10px]", "motion-duration-[1.00s]/blur",  "motion-ease-spring-smooth", "motion-delay-[0.23s]/blur")
                })
            }else if(!image.isIntersecting && img.src != "/images/placeholder.jpg"){
                img.src = "/images/placeholder.jpg"

                img.addEventListener('load', ()=>{
                    img.classList.remove("motion-blur-in-[10px]", "motion-duration-[1.00s]/blur",  "motion-ease-spring-smooth", "motion-delay-[0.23s]/blur")
                })
                console.log("Loaded placeholder")
            }
        });
    })

    lazyImages.forEach(image => observer.observe(image))

})



function buildQueryParam(filterObj, key, value) {
    const baseURL = new URL(window.location.href)
    const baseURLparams = baseURL.searchParams

    if (filterObj){
        for (const [key, value] of Object.entries(filterObj)) {
            console.log(`Looking at ${key}, ${value}`)
            if(value === "" || value === undefined || value === null){
                baseURLparams.delete(key)
            }else if(Array.isArray(value)){
                baseURLparams.delete(key)
                value.forEach(tempV => baseURLparams.append(key, tempV))
            }else{
                baseURLparams.set(key, value)
                console.log(`Added ${key}, ${value}`)
            }
        }
    }else if(key){
        if (value === "" || value === undefined || value === null){
            baseURLparams.delete(key)
        }else{
            baseURLparams.set(key, value) 
        }
    }

    window.location.href = baseURL.toString()
    
        
}

function applyFilters() {
    const form = document.getElementById('filterForm')

    const formData = new FormData(form)
    const filters = {}

    formData.forEach((value, key) => {
        if (filters[key]){
            filters[key] = Array.isArray(filters[key]) ? [... filters[key], value] : [filters[key], value]
        }else{
            filters[key] = value
        }
    })
    buildQueryParam(filters, null, null)
}

function loadPetPage(elementId) {
    window.location.href = `/adopt/pet/${elementId}`
}


