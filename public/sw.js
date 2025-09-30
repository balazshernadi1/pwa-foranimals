const TO_CACHE = [
    "/fallback",
    "/manifest.json",
    "/images/sad_dog.png",
    "/css/styles.css",
    "/css/tailwind-output.css",
]
const CACHE_NAME = "fallback-cache-v1"

const cacheResources = async (resources) => {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(resources)
    console.log("Resources cached")
};

const networkFirst = async (request) => {
    try {
        const response = await fetch(request)

        if (response.redirected){
            return response.redirect(response.url, response.status)
        
        }
        return response
    } catch (error) {
        console.error("Network request failed, serving from cache:", error)

        
        const cachedResponse = await caches.match(request)
        if (cachedResponse) {
            return cachedResponse
        }
       
        if (request.mode === "navigate") {
            return caches.match("/fallback")
        }
        
        return new Response("Resource not available offline", {
            status: 503,
            statusText: "Service Unavailable",
        })
    }
}

self.addEventListener("install", (event) => {
    event.waitUntil(cacheResources(TO_CACHE))
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`Deleting old cache: ${cache}`)
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
    self.clients.claim()
});

self.addEventListener("fetch", (event) => {
    console.log("FETCHING:", event.request.url)

    const url = new URL(event.request.url)

    
    if (url.origin.includes("cdn.jsdelivr.net") || url.origin.includes("summativepetimages.blob.core.windows.net")) {
        return
    }

    event.respondWith(networkFirst(event.request))
})
