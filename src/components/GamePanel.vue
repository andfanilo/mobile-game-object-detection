<template>
  <div class="container">
    <div class="header">
      <h4 class="lead">Find objects</h4>
      <div class="score">Score: {{score}}</div>
      <div class="timer">Time : {{timer}}</div>
    </div>
    <div ref="videoWrapper" class="webcam-wrapper">
      <video ref="video" class="webcam-wrapper__video" id="video" autoplay muted playsinline />
      <svg
        class="webcam-wrapper__canvas"
        v-bind:height="videoHeight"
        v-bind:width="videoWidth"
        v-bind:viewBox="svgViewbox"
        preserveAspectRatio="none"
      >
        <rect
          v-for="zone in zones"
          v-bind:key="`${zone.label}-frame-${zone.bbox.x1}-${zone.bbox.y1}`"
          v-bind:x="zone.bbox.x1"
          v-bind:y="zone.bbox.y1"
          v-bind:width="zone.bbox.x2 - zone.bbox.x1"
          v-bind:height="zone.bbox.y2 - zone.bbox.y1"
          v-bind:stroke="`rgb(${zone.bbox.color})`"
          stroke-width="3"
          fill-opacity="0"
        />
        <rect
          v-for="zone in zones"
          v-bind:key="`${zone.label}-textBox-${zone.bbox.x1}-${zone.bbox.y1}`"
          v-bind:x="zone.bbox.x1"
          v-bind:y="zone.bbox.y1"
          v-bind:width="zone.bbox.x2 - zone.bbox.x1"
          v-bind:height="textBoxHeight"
          v-bind:fill="`rgb(${zone.bbox.color})`"
        />
        <text
          v-for="zone in zones"
          v-bind:key="`${zone.label}-label-${zone.bbox.x1}-${zone.bbox.y1}`"
          v-bind:x="zone.bbox.x1"
          v-bind:y="zone.bbox.y1 + textBoxHeight"
        >{{`${zone.label}:${zone.confidence.toFixed(2)}`}}</text>
      </svg>
    </div>
    <animated-word-list class="footer" :words="Array.from(foundWords).reverse()" />
    <canvas ref="canvas" class="canvas" :width="frameWidth" :height="frameHeight"></canvas>
  </div>
</template>

<script>
import AnimatedWordList from "./AnimatedWordList.vue";

const constraints = {
  video: { facingMode: "environment" },
  audio: false
};

export default {
  name: "GamePanel",
  components: { AnimatedWordList },
  data() {
    return {
      video: null, // reference to video element
      canvas: null, // invisible canvas to store frames to send to server
      zones: [], // zones returned by the server and displayed in realtime in SVG element
      frameWidth: 640,
      frameHeight: 480,
      // cameraSettings: {},  internal camera resolution to pass to svg viewbox
      videoWidth: 0, // refresh width of video that is passed to svg width
      videoHeight: 0, // refresh height of video that is passed to svg height
      zoneRefreshClock: null, // JS interval which periodically get zones from server
      timerClock: null, // JS interval which periodically removes a second from the timer
      score: 0,
      timer: 90,
      foundWords: new Set(), // all unique labels found by the user
      textBoxHeight: 14, // height of text displayed in svg
      isComputing: 0 // Is a request waiting ?
    };
  },
  props: ["startVideo", "name"], // watch the startVideo property which will be changed by parent App
  watch: {
    startVideo: "startGame" // when parent App changes the startVideo property, run the startGame method
  },
  computed: {
    svgViewbox: function() {
      return `0 0 ${this.frameWidth} ${this.frameHeight}`;
    }
  },
  methods: {
    /**
     * Start game by initializing the timer and zone refresh clocks
     */
    startGame(startVideo) {
      if (startVideo) {
        this.zoneRefreshClock = setInterval(
          this.updateZones.bind(this),
          process.env.VUE_APP_REFRESH_RATE
        );
        this.timerClock = setInterval(this.manageTimer.bind(this), 1000);
      }
    },
    /**
     * Run prediction on a frame of video to retrieve a list of zones.
     * Also update score and list of unique words here.
     * The update of zones will automatically update the svg.
     */
    updateZones() {
      if (this.isComputing == 0) {
        this.isComputing = 1;
        var context = this.canvas.getContext("2d");
        context.drawImage(this.video, 0, 0, this.frameWidth, this.frameHeight);

        this.canvas.toBlob(
          blob => {
            // predict on blob image
            console.log(blob);
            this.zones = [
              {
                bbox: {
                  x1: 20,
                  y1: 60,
                  x2: 400,
                  y2: 300,
                  color: "255,0,0"
                },
                label: "cat",
                confidence: 0.8380282521247864
              },
              {
                bbox: {
                  x1: 10,
                  y1: 30,
                  x2: 50,
                  y2: 50,
                  color: "0,255,0"
                },
                label: "dog",
                confidence: 0.8380282521247864
              }
            ];

            this.isComputing = 0;
            this.zones.forEach(zone => this.foundWords.add(zone.label));
            this.score = this.foundWords.size;

            // ******************** draw zones on canvas ********************
            this.zones.forEach(zone => {
              const bbox = zone.bbox;
              const label = zone.label;
              const x1 = bbox.x1;
              const x2 = bbox.x2;
              const y1 = bbox.y1;
              const y2 = bbox.y2;
              const boxColor = `rgb(${bbox.color})`;

              const l = x2 - x1;
              const h = y2 - y1;

              context.lineWidth = 5;
              context.strokeStyle = boxColor;
              context.strokeRect(x1, y1, l, h);

              context.fillStyle = boxColor;
              const width = context.measureText(label).width;
              const height = parseInt(context.font, 10);
              context.fillRect(
                bbox.x1 - 3,
                bbox.y1 - height,
                width + 5,
                height
              ); // -3 -> for width of line | +5 -> cover end of text

              context.fillStyle = "black";
              context.font = "24px serif";
              context.fillText(label, x1, y1 - 3);
              // ******************** end draw on canvas ********************
            });
          },
          "image/jpeg",
          0.1
        );
      } else {
        console.log("Waiting");
      }
    },
    /**
     * Decrement timer to 0, and emit an end-game event back to parent App when timer is at 0
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
     * Clean all states of the component
     */
    cleanApp() {
      clearInterval(this.zoneRefreshClock);
      clearInterval(this.timerClock);

      this.video.srcObject.getTracks()[0].stop();
      this.video.srcObject = null;

      window.removeEventListener("resize", this.handleWindowResize);
      window.removeEventListener("orientationchange", this.handleWindowResize);
      this.video.removeEventListener("loadedmetadata", this.handleWindowResize);
    },
    /**
     * Update our width and height  variables for video element
     */
    handleWindowResize() {
      this.videoWidth = this.video.offsetWidth;
      this.videoHeight = this.video.offsetHeight;
    }
  },
  mounted() {
    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          /*
          var videoTracks = stream.getVideoTracks();

          this.cameraSettings = videoTracks[0].getSettings();
          /*this.svgViewbox = `0 0 ${this.cameraSettings.width} ${
            this.cameraSettings.height
          }`;*/

          this.video.srcObject = stream;
          this.video.play();

          //Listen for the loadedmetadata event which is dispatched when the user agent has just determined the duration and dimensions of the media resource
          this.video.addEventListener(
            "loadedmetadata",
            this.handleWindowResize
          );
          window.addEventListener("resize", this.handleWindowResize);
          window.addEventListener("orientationchange", this.handleWindowResize);
        })
        .catch(err => console.log("navigator.getUserMedia error: ", err));
    }
  },
  beforeDestroy: function() {
    this.cleanApp();
  }
};
</script>

<style scoped>
.canvas {
  position: absolute;
  /* debug purposes - change display to show canvas with zones on top of video*/
  display: none;
  z-index: 99;
}

.header {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 0.7em;
  background-color: #0066a1;
  color: #fcfcfc;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  overflow: hidden;
}

.lead {
  flex: 1;
  margin: 0;
}

.score {
  flex: 1;
}

.timer {
  flex: 1;
}

.webcam-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.webcam-wrapper__video {
  background-color: #000000;
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.webcam-wrapper__canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 3em;
  background-color: #0066a1;
  color: #fcfcfc;
  z-index: 1;
  overflow: hidden;
}
</style>
