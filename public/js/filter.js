   let activeDropDown
   
   function translateIn(dropdown) {
        dropdown.classList.remove('hidden')
        dropdown.classList.add('flex')
        setTimeout(()=>{
            dropdown.classList.remove('opacity-0','-translate-y-1/2')
            if(dropdown != activeDropDown){
                document.addEventListener('click', clickOutsideMenu)
            }
            activeDropDown = dropdown
        }, 10)
        
    }

    function translateOut(dropdown) {
        dropdown.classList.add('opacity-0', '-translate-y-1/2')
        setTimeout(()=>{
            dropdown.classList.remove('flex')
            dropdown.classList.add('hidden')
        },450) 
        document.removeEventListener('click', clickOutsideMenu)
        activeDropDown = null
    }


    function clickOutsideMenu(event) {
        if (activeDropDown && !activeDropDown.contains(event.target)){
            translateOut(activeDropDown)
        }
    }

    
    function translateFilterMenuOut(){
        const filter_menu = document.getElementById('filter_menu')
        filter_menu.classList.add('opacity-0', 'translate-x-full')
        
    }
    

    function translateFilterMenuIn() {
        const filter_menu = document.getElementById('filter_menu')
        filter_menu.classList.remove('opacity-0', 'translate-x-full')
    }


    function toggleFiltMenu(MENU) {
        let dropdown
        
        switch (MENU) {
            case 'sort':
                dropdown = document.getElementById('dropdown_sort')
                break
            case 'itm':
                dropdown = document.getElementById('dropdown_itm')
                break
            default:
                console.error('Invalid MENU type')
                return
        }

        if (dropdown.classList.contains('hidden')){
            translateIn(dropdown)
        }else{
            translateOut(dropdown)
        }
    }

    const minGap = 1

    function changeMaxAge() {
        const maxValueDisplay = document.getElementById('maxValue')
        const maxAge = document.getElementById('maxAge')
        const minAge = document.getElementById('minAge')
        if (parseInt(maxAge.value) - parseInt(minAge.value) <= minGap){
            maxAge.value = minAge.value + minGap
        }

        maxValueDisplay.textContent = maxAge.value
       

    }

    function changeMinAge() {
        const minValueDisplay = document.getElementById('minValue')
        const minAge = document.getElementById('minAge')
        const maxAge = document.getElementById('maxAge')
        if (parseInt(maxAge.value) - parseInt(minAge.value) <= minGap){
            minAge.value = maxAge.value - minGap
            
        }
        minValueDisplay.textContent = minAge.value
    }

    async function getBreeds() {
        const speciesValue = document.getElementById('species').value
        const breedSelector = document.getElementById('breed')

        if (!speciesValue || speciesValue == "default"){
            breedSelector.disabled = true
            breedSelector.innerHTML = '<option value="default">Select Breed</option>'
            return
        }

        try {

            const response = await fetch(`/adopt/getBreeds?species=${speciesValue}`)

            if (!response.ok){
                const errorMessage = await response.text()
                console.log("Error", errorMessage)
                return
            }

            const result = await response.json()
            const breeds = result.breeds

            breeds.forEach(breed => {
                const breedOption = document.createElement('option')
                breedOption.value = breed
                breedOption.textContent = breed
                breedSelector.appendChild(breedOption)
            });

            breedSelector.disabled = false
            
        } catch (error) {
            console.log("Error", error)
            breedSelector.disabled = true
            breedSelector.innerHTML = '<option value="default">Select Breed</option>'
        }
        
    }

    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        const url = new URL(window.location.href)
        const searchParams = url.searchParams
    
        const filtersToRemove = ['locations', 'minAge', 'maxAge', 'species', 'breed', 'colours', 'features']
    
        filtersToRemove.forEach((filter) => searchParams.delete(filter))
    
        url.search = searchParams.toString()
        window.location.href = url.toString()
    })
    