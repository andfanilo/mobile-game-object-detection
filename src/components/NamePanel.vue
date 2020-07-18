<template>
  <div class="panel">
    <div class="panel__content">
      <h1>Welcome to the mobile game object detector !</h1>
      <p>Our model can recognize up to 110 different objects. How many can you detect in 90 seconds ?</p>
      <p>
        <input v-model="inputName" placeholder="Enter your name" />
      </p>
      <button class="panel__content__play" :disabled="inputName === ''" @click="handleClick()">Play</button>
    </div>
  </div>
</template> 

<script>
export default {
  name: "NamePanel",
  data() {
    return {
      inputName: ""
    };
  },
  methods: {
    handleClick() {
      this.$emit("start-game", this.inputName);
    }
  }
};
</script>

<style scoped>
.panel {
  background-color: #0066a1;
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

.panel__content__play {
  padding: 1em;
  font-size: 1.5rem;
  text-decoration: none;
}
</style>
