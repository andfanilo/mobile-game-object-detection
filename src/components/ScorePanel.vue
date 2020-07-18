<template>
  <div class="panel">
    <div class="panel__content">
      <h2>Thanks for playing {{name}}</h2>
      <h2>You are in position {{position}} with a score of {{score}}</h2>
      <table class="leaderboard">
        <thead>
          <th>Username</th>
          <th>Score</th>
        </thead>
        <tbody>
          <template v-for="row in leaderboard.slice(0, 4)">
            <tr v-bind:key="`${row.pseudo}-row`">
              <td v-bind:key="`${row.pseudo}-pseudo`">{{row.pseudo}}</td>
              <td v-bind:key="`${row.pseudo}-score`">{{row.score}}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template> 

<script>
export default {
  name: "ScorePanel",
  props: ["name", "score", "position", "leaderboard"]
};
</script>

<style scoped>
.panel {
  background-color: #ff6319;
  text-align: center;
  overflow-x: hidden;
}

.panel__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fcfcfc;
  padding: 3em;
}

.url {
  font-size: 1.2rem;
  color: #fcfcfc;
}
</style>
