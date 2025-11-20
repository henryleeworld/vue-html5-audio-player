const app = Vue.createApp({
    data() {
        return {
            audio: null,
            circleLeft: null,
            barWidth: null,
            duration: null,
            currentTime: null,
            isTimerPlaying: false,
            tracks: [{
                    name: "Destiny -太陽の花-",
                    artist: "島谷ひとみ",
                    cover: "images/destiny-taiyo-no-hana.jpg",
                    source: "music/destiny-taiyo-no-hana.mp3",
                    url: "https://www.youtube.com/watch?v=6cgQ76eEYAU",
                    favorited: false
                },
                {
                    name: "fantastic",
                    artist: "鈴木亜美",
                    cover: "images/fantastic.jpg",
                    source: "music/fantastic.mp3",
                    url: "https://www.youtube.com/watch?v=ufNwJac2qBw",
                    favorited: true
                },
                {
                    name: "Raimei",
                    artist: "T.M.Revolution",
                    cover: "images/raimei.jpg",
                    source: "music/raimei.mp3",
                    url: "https://www.youtube.com/watch?v=jCrWHBmZNuE",
                    favorited: false
                },
                {
                    name: "Re-Sublimity",
                    artist: "KOTOKO",
                    cover: "images/re-sublimity.jpg",
                    source: "music/re-sublimity.mp3",
                    url: "https://www.youtube.com/watch?v=m3PehRdfatI",
                    favorited: false
                },
                {
                    name: "Merry-Go-Round",
                    artist: "CHEMISTRY",
                    cover: "images/merry-go-round.jpg",
                    source: "music/merry-go-round.mp3",
                    url: "https://www.youtube.com/watch?v=YOWZRHFIT5A",
                    favorited: false
                },
                {
                    name: "SHINING☆STAR",
                    artist: "9nine",
                    cover: "images/shining-star.jpg",
                    source: "music/shining-star.mp3",
                    url: "https://www.youtube.com/watch?v=e-l-8xJHUfs",
                    favorited: true
                }
            ],
            currentTrack: null,
            currentTrackIndex: 0,
            transitionName: null
        };
    },

    methods: {
        play() {
            if (this.audio.paused) {
                this.audio.play();
                this.isTimerPlaying = true;
            } else {
                this.audio.pause();
                this.isTimerPlaying = false;
            }
        },

        generateTime() {
            let width = (100 / this.audio.duration) * this.audio.currentTime;
            this.barWidth = width + "%";
            this.circleLeft = width + "%";

            let durmin = Math.floor(this.audio.duration / 60);
            let dursec = Math.floor(this.audio.duration % 60);
            let curmin = Math.floor(this.audio.currentTime / 60);
            let cursec = Math.floor(this.audio.currentTime % 60);

            if (durmin < 10) durmin = "0" + durmin;
            if (dursec < 10) dursec = "0" + dursec;
            if (curmin < 10) curmin = "0" + curmin;
            if (cursec < 10) cursec = "0" + cursec;

            this.duration = `${durmin}:${dursec}`;
            this.currentTime = `${curmin}:${cursec}`;
        },

        updateBar(x) {
            const progress = this.$refs.progress;
            let max = this.audio.duration;
            let pos = x - progress.offsetLeft;
            let percentage = (100 * pos) / progress.offsetWidth;

            percentage = Math.min(Math.max(percentage, 0), 100);

            this.barWidth = percentage + "%";
            this.circleLeft = percentage + "%";
            this.audio.currentTime = (max * percentage) / 100;
            this.audio.play();
        },

        clickProgress(e) {
            this.isTimerPlaying = true;
            this.audio.pause();
            this.updateBar(e.pageX);
        },

        prevTrack() {
            this.transitionName = "scale-in";
            this.isShowCover = false;

            if (this.currentTrackIndex > 0) {
                this.currentTrackIndex--;
            } else {
                this.currentTrackIndex = this.tracks.length - 1;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
        },

        nextTrack() {
            this.transitionName = "scale-out";
            this.isShowCover = false;

            if (this.currentTrackIndex < this.tracks.length - 1) {
                this.currentTrackIndex++;
            } else {
                this.currentTrackIndex = 0;
            }
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.resetPlayer();
        },

        resetPlayer() {
            this.barWidth = 0;
            this.circleLeft = 0;
            this.audio.currentTime = 0;
            this.audio.src = this.currentTrack.source;

            setTimeout(() => {
                if (this.isTimerPlaying) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }, 300);
        },

        favorite() {
            const track = this.tracks[this.currentTrackIndex];
            track.favorited = !track.favorited;
        }
    },

    created() {
        this.currentTrack = this.tracks[0];

        this.audio = new Audio();
        this.audio.src = this.currentTrack.source;

        this.audio.ontimeupdate = () => this.generateTime();
        this.audio.onloadedmetadata = () => this.generateTime();
        this.audio.onended = () => {
            this.nextTrack();
            this.isTimerPlaying = true;
        };

        // Prefetch images
        this.tracks.forEach(t => {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.href = t.cover;
            link.as = "image";
            document.head.appendChild(link);
        });
    }
});

app.mount("#app");