class VideoPreloader {
    constructor() {
        this.videos = []
        this.loadedCount = 0
        this.totalVideos = 0
        this.completeCallback = null
        this.timeoutId = null
        this.maxWaitTime = 30000 // 30 seconds max wait time
    }

    findVideos() {
        this.videos = Array.from(document.querySelectorAll("video"))
        this.totalVideos = this.videos.length
        console.log(`Found ${this.totalVideos} videos to preload`)

        const platformFolder = this.getPlatformFolder()
        alert(platformFolder)

        this.videos.forEach((video) => {
            const baseSrc = video.getAttribute("data-src")
            console.log(baseSrc);
            if (baseSrc) {
                const finalSrc = `assets/${platformFolder}/${baseSrc}`
                video.src = finalSrc
                console.log(`Set video src to: ${finalSrc}`)
            }
        })

        return this
    }

    getPlatformFolder() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        return isMobile ? "mobile" : "desktop"
    }

    setCompleteCallback(callback) {
        this.completeCallback = callback
        return this
    }

    startPreloading() {
        if (this.videos.length === 0) {
            console.log("No videos found to preload")
            if (this.completeCallback) {
                this.completeCallback()
            }
            return this
        }

        console.log(`Starting to preload ${this.videos.length} videos...`)

        this.timeoutId = setTimeout(() => {
            console.log("Preloading timed out after 30 seconds, starting application anyway")
            if (this.completeCallback) {
                this.completeCallback()
            }
        }, this.maxWaitTime)

        this.loadVideosSequentially(0)

        return this
    }

    loadVideosSequentially(index) {
        if (index >= this.videos.length || this.loadedCount >= this.totalVideos) {
            clearTimeout(this.timeoutId)
            console.log("All videos loaded successfully!")
            if (this.completeCallback) {
                this.completeCallback()
            }
            return
        }

        const video = this.videos[index]
        const videoId = video.id || `Video ${index + 1}`

        const eventHandler = () => {
            this.loadedCount++
            const progress = Math.round((this.loadedCount / this.totalVideos) * 100)
            console.log(`Video loaded (${this.loadedCount}/${this.totalVideos}): ${videoId} - ${progress}% complete`)

            video.removeEventListener("canplaythrough", eventHandler)
            video.removeEventListener("error", errorHandler)

            this.loadVideosSequentially(index + 1)
        }

        const errorHandler = () => {
            console.error(`Failed to load video: ${videoId}`)
            this.loadedCount++
            video.removeEventListener("canplaythrough", eventHandler)
            video.removeEventListener("error", errorHandler)
            this.loadVideosSequentially(index + 1)
        }

        video.addEventListener("canplaythrough", eventHandler, { once: true })
        video.addEventListener("error", errorHandler, { once: true })
        video.preload = "auto"
        video.load()

        if (this.isIOS()) {
            video.muted = true
            const playPromise = video.play()
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    video.pause()
                    video.currentTime = 0
                }).catch((error) => {
                    console.error(`Error during play/pause for ${videoId}:`, error)
                })
            }
        }
    }

    isIOS() {
        return (
            ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
            (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        )
    }
}
