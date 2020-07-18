<template>
  <div class="container">
    <h4 class="lead">{{header}}</h4>
    <div class="score">Score: {{score}}</div>
    <div class="timer">Time : {{timer}}</div>
  </div>
</template>

<script>
export default {
  name: "GameInfo",
  props: { header: String, score: Number, timer: Number }
};
</script>

<style scoped>
.container {
  padding: 0.7em;
  background-color: #0066a1;
  color: #fcfcfc;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>