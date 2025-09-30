document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#nav_links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('underline'); 
        } else {
            link.classList.remove('underline'); 
        }
    });

    const burger_menu = document.getElementById('burger-menu');
    burger_menu.addEventListener("click", toggleMenu)


});

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const nav_links = document.querySelectorAll('#nav_links a')
    sidebar.classList.toggle('-translate-x-full');

    if (!sidebar.classList.contains('-translate-x-full')){
        nav_links.forEach((element,index) => {
            element.classList.add("motion-preset-slide-right");
        });
    }else{
        nav_links.forEach((element, index) => {
            element.classList.remove("motion-preset-slide-right");
        });
    }

}

function toggleAccountMenu(){
    const sidebar = document.getElementById('accountSideBar')
    const isLoggedIn = sidebar.dataset.loggedIn
    if(isLoggedIn === "true"){
        sidebar.classList.toggle('translate-x-full')
    }else{
        window.location.href = "/login"
    }
    
}

if ('serviceWorker' in navigator) {
    window.addEventListener("load", async ()=>{
        try{
            const registration = await navigator.serviceWorker.register('./sw.js', {scope : "/"})
            if (registration.installing) {
                console.log('Service worker installing')
                } else if (registration.waiting) {
                console.log('Service worker installed')
                } else if (registration.active) {
                console.log('Service worker active')
                }
        }catch(error){
            console.error(`ServiceWorker registration failed ${error}`)
        }
      
    })
}