<template>
  <div class="container">
    <game-info class="header" header="Find objects" :score="score" :timer="timer" />
    <video-frame class="video-wrapper" />
    <animated-word-list class="footer" :words="Array.from(foundWords).reverse()" />
  </div>
</template>

<script>
import AnimatedWordList from "./AnimatedWordList.vue";
import GameInfo from "./GameInfo.vue";
import VideoFrame from "./VideoFrame.vue";

export default {
  name: "GamePanel",
  components: { AnimatedWordList, GameInfo, VideoFrame },
  data() {
    return {
      timerClock: null, // JS interval which periodically removes a second from the timer
      timer: 90,
      score: 0,
      zoneRefreshClock: null, // JS interval which periodically get zones from server
      foundWords: new Set(["cat", "dog"]) // all unique labels found by the user
    };
  },
  props: ["startGame"], // watch the startGame property which will be changed by parent App
  watch: {
    startGame: "handleStartGame" // when parent App changes the startGame property, run the startGame method
  },
  methods: {
    /**
     * Start game by initializing a timer
     * And a periodic prediction of zones for detected objects
     */
    handleStartGame() {
      if (this.startGame) {
        this.zoneRefreshClock = setInterval(
          this.updateZones.bind(this),
          process.env.VUE_APP_REFRESH_RATE
        );
        this.timerClock = setInterval(this.manageTimer.bind(this), 1000);
      }
    },
    /**
     * Decrement timer to 0
     * Clean component
     * Emit an end-game event back to parent App when timer is at 0
     */
    manageTimer() {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.cleanApp();
        this.$emit("end-game", {
          score: this.score,
          leaderboard: [{ pseudo: "HOOOOY", score: this.score + 42 }],
          position: 42
        });
      }
    },
    /**
     * Run zone prediction on video element.
     * Retrieve all labels into foundWords
     */
    updateZones() {
      console.log("update");
    },
    /**
     * Clean all states of the component
     */
    cleanApp() {
      clearInterval(this.zoneRefreshClock);
      clearInterval(this.timerClock);
    }
  },
  beforeDestroy: function() {
    this.cleanApp();
  }
};
</script>

<style scoped>
.header {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
  overflow: hidden;
}

.video-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 3em;
  z-index: 1;
  overflow: hidden;
}
</style>
