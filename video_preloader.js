class VideoPreloader {
    constructor() {
        this.videos = []
        this.loadedCount = 0
        this.totalVideos = 0
        this.completeCallback = null
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

        // Set all videos to preload="auto" to force loading
        this.videos.forEach((video, index) => {
            video.preload = "auto"

            // Handle when video data is loaded
            video.addEventListener("loadeddata", () => {
                this.loadedCount++
                const progress = Math.round((this.loadedCount / this.totalVideos) * 100)
                console.log(
                    `Video loaded (${this.loadedCount}/${this.totalVideos}): ${video.id || `Video ${index + 1}`} - ${progress}% complete`,
                )

                // Check if all videos are loaded
                if (this.loadedCount === this.totalVideos) {
                    console.log("All videos loaded successfully!")
                    if (this.completeCallback) {
                        this.completeCallback()
                    }
                }
            })

            // Handle loading errors
            video.addEventListener("error", () => {
                console.error(`Failed to load video: ${video.id || `Video ${index + 1}`}`)
                this.loadedCount++

                // Continue even if some videos fail to load
                if (this.loadedCount === this.totalVideos) {
                    console.log("Video loading completed with some errors")
                    if (this.completeCallback) {
                        this.completeCallback()
                    }
                }
            })

            // Force the browser to start loading the video
            video.load()
        })

        return this
    }
}