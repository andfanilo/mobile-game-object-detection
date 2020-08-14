<template>
  <div>
    <video ref="video" class="video-wrapper__video" id="video" autoplay muted playsinline />
    <zones-frame
      class="video-wrapper__zones"
      :height="videoHeight"
      :width="videoWidth"
      :viewBox="zonesViewbox"
      :zones="zones"
    />
    <canvas ref="canvas" class="canvas" :width="frameWidth" :height="frameHeight"></canvas>
  </div>
</template>

<script>
import ZonesFrame from "./ZonesFrame.vue";
import CocoSSDMixin from "../mixins/CocoSSDMixin";

const constraints = {
  video: { facingMode: "environment" },
  audio: false,
};

export default {
  name: "VideoFrame",
  components: { ZonesFrame },
  mixins: [CocoSSDMixin],
  data() {
    return {
      zones: [], // zones returned by the model, to display in ZonesFrame
      video: null, // reference to video element
      invisibleCanvas: null, // reference to canvas where sending lowres video for prediction
      predictionClock: null, // JS interval which periodically get zones from model
      frameWidth: 640,
      frameHeight: 480,
      videoWidth: 0, // refresh width of video that is passed to svg width
      videoHeight: 0, // refresh height of video that is passed to svg height
    };
  },
  props: ["playVideo"],
  watch: {
    playVideo: "handleVideoPropChange", // when parent App changes the startGame property, run the startGame method
  },
  computed: {
    zonesViewbox: function () {
      return `0 0 ${this.frameWidth} ${this.frameHeight}`;
    },
  },
  methods: {
    /**
     * Start ML periodic prediction if video is activated
     * Else stop prediction and video
     */
    handleVideoPropChange() {
      if (this.playVideo) {
        this.predictionClock = setInterval(
          this.detectObjects.bind(this),
          process.env.VUE_APP_REFRESH_RATE
        );
      } else {
        this.cleanup();
      }
    },
    /**
     * Run zone prediction on video element.
     * Retrieve all labels into foundWords
     */
    detectObjects() {
      let context = this.invisibleCanvas.getContext("2d");
      context.drawImage(this.video, 0, 0, this.frameWidth, this.frameHeight);
      this.model.detect(this.invisibleCanvas).then(
        (zones) => {
          console.log(zones);
        },
        (error) => {
          console.log(error);
        }
      );
      //const things = ["Rock", "Paper", "Scissor", "Cat", "Dog", "Fish"];
      //const thing = things[Math.floor(Math.random() * things.length)];
      //this.$emit("zone-prediction", [thing]);
    },
    /**
     * Update our width and height variables for video element
     */
    handleWindowResize() {
      this.videoWidth = this.video.offsetWidth;
      this.videoHeight = this.video.offsetHeight;
    },
    /**
     * Clean timer and video
     */
    cleanup() {
      clearInterval(this.predictionClock);

      this.video.srcObject.getTracks()[0].stop();
      this.video.srcObject = null;

      window.removeEventListener("resize", this.handleWindowResize);
      window.removeEventListener("orientationchange", this.handleWindowResize);
      this.video.removeEventListener("loadedmetadata", this.handleWindowResize);
    },
  },
  mounted() {
    this.video = this.$refs.video;
    this.invisibleCanvas = this.$refs.canvas;

    this.zones = [
      {
        bbox: {
          x1: 20,
          y1: 60,
          x2: 400,
          y2: 300,
          color: "255,0,0",
        },
        label: "cat",
        confidence: 0.8380282521247864,
      },
      {
        bbox: {
          x1: 10,
          y1: 30,
          x2: 50,
          y2: 50,
          color: "0,255,0",
        },
        label: "dog",
        confidence: 0.8380282521247864,
      },
    ];

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();

          // Listen for the loadedmetadata event which is dispatched
          // when the user agent has just determined the duration and dimensions of the media resource
          this.video.addEventListener(
            "loadedmetadata",
            this.handleWindowResize
          );
          window.addEventListener("resize", this.handleWindowResize);
          window.addEventListener("orientationchange", this.handleWindowResize);

          this.$emit("webcam-ready");
        })
        .catch((err) => console.log("navigator.getUserMedia error: ", err));
    }
  },
  beforeDestroy() {
    this.cleanup();
  },
};
</script>

<style scoped>
.canvas {
  position: absolute;
  display: none;
  z-index: 99;
}

.video-wrapper__video {
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

.video-wrapper__zones {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
