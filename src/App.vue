<template>
  <div id="app">
    <loading
      :active="!(modelLoaded & webcamReady)"
      :can-cancel="false"
      :is-full-page="true"
      :z-index="9"
      color="#428bca"
    ></loading>
    <name-panel
      class="name-panel"
      @start-game="handleStartGame"
      :class="{ 'name-panel--collapsed': gameStarted }"
    />
    <game-panel
      @model-loaded="modelLoaded = true"
      @webcam-ready="webcamReady = true"
      :startGame="gameStarted"
      @end-game="handleEndGame"
    />
    <score-panel
      class="score-panel"
      :inputName="inputName"
      :score="score"
      :leaderboard="leaderboard"
      :position="position"
      :class="{ 'score-panel--collapsed': gameEnded }"
    />
  </div>
</template>

<script>
import NamePanel from "./components/NamePanel.vue";
import GamePanel from "./components/GamePanel.vue";
import ScorePanel from "./components/ScorePanel.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "app",
  components: {
    NamePanel,
    GamePanel,
    ScorePanel,
    Loading
  },
  data() {
    return {
      inputName: "",
      score: 0,
      position: -1,
      leaderboard: [],
      modelLoaded: false,
      webcamReady: false,
      gameStarted: false,
      gameEnded: true
    };
  },
  methods: {
    handleModelLoaded: function() {
      this.modelLoaded = true;
    },
    handleStartGame: function(event) {
      if (this.modelLoaded) {
        this.inputName = event;
        this.gameStarted = true;
      }
    },
    handleEndGame: function(event) {
      this.score = event.score;
      this.leaderboard = event.leaderboard;
      this.position = event.position;
      this.gameEnded = false;
    }
  }
};
</script>

<style>
:root {
  box-sizing: border-box;
}

*,
::before,
::after {
  box-sizing: inherit;
}

body {
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* LAYOUT */

.name-panel {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.5s;
  z-index: 2;
}

.name-panel--collapsed {
  width: 0%;
}

.score-panel {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.5s;
  z-index: 2;
}

.score-panel--collapsed {
  width: 0%;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 1.5em;
}

td,
th {
  border: 1px solid #fcfcfc;
  padding: 0.5em 2em;
  text-align: center;
}
</style>
