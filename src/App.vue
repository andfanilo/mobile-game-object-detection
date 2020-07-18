<template>
  <div id="app">
    <name-panel
      class="name-panel"
      @start-game="handleStartGame"
      :class="{ 'name-panel--collapsed': gameStarted }"
    />
    <game-panel :startGame="gameStarted" :name="name" @end-game="handleEndGame" />
    <score-panel
      class="score-panel"
      :name="name"
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

export default {
  name: "app",
  components: {
    NamePanel,
    GamePanel,
    ScorePanel
  },
  data() {
    return {
      name: "",
      score: 0,
      position: -1,
      leaderboard: [],
      gameStarted: false,
      gameEnded: true
    };
  },
  methods: {
    handleStartGame: function(value) {
      this.name = value;
      this.gameStarted = true;
    },
    handleEndGame: function(value) {
      this.score = value.score;
      this.leaderboard = value.leaderboard;
      this.position = value.position;
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
