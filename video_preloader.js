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
        return this
    }

    setCompleteCallback(callback) {
        this.completeCallback = callback
        return this
    }

    startPreloading() {
        // If no videos found, complete immediately
        if (this.videos.length === 0) {
            console.log("No videos found to preload")
            if (this.completeCallback) {
                this.completeCallback()
            }
            return this
        }

        console.log(`Starting to preload ${this.videos.length} videos...`)

        // Set a timeout to prevent infinite waiting
        this.timeoutId = setTimeout(() => {
            console.log("Preloading timed out after 30 seconds, starting application anyway")
            if (this.completeCallback) {
                this.completeCallback()
            }
        }, this.maxWaitTime)

        // Load videos in sequence (works better on both mobile and desktop)
        this.loadVideosSequentially(0)

        return this
    }

    loadVideosSequentially(index) {
        // If we've loaded all videos or reached the end, we're done
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

        // Use canplaythrough instead of loadeddata for better mobile compatibility
        const eventHandler = () => {
            this.loadedCount++
            const progress = Math.round((this.loadedCount / this.totalVideos) * 100)
            console.log(`Video loaded (${this.loadedCount}/${this.totalVideos}): ${videoId} - ${progress}% complete`)

            // Remove the event listeners
            video.removeEventListener("canplaythrough", eventHandler)
            video.removeEventListener("error", errorHandler)

            // Load the next video
            this.loadVideosSequentially(index + 1)
        }

        const errorHandler = () => {
            console.error(`Failed to load video: ${videoId}`)
            this.loadedCount++

            // Remove the event listeners
            video.removeEventListener("canplaythrough", eventHandler)
            video.removeEventListener("error", errorHandler)

            // Continue with the next video even if this one failed
            this.loadVideosSequentially(index + 1)
        }

        // Add event listeners
        video.addEventListener("canplaythrough", eventHandler, { once: true })
        video.addEventListener("error", errorHandler, { once: true })

        // Set video attributes for loading
        video.preload = "auto"
        video.load()

        // For iOS, we need to play and immediately pause to start loading
        if (this.isIOS()) {
            video.muted = true
            const playPromise = video.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        video.pause()
                        video.currentTime = 0
                    })
                    .catch((error) => {
                        console.error(`Error during play/pause for ${videoId}:`, error)
                    })
            }
        }
    }

    isIOS() {
        return (
            ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||
            // iPad on iOS 13 detection
            (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        )
    }
}