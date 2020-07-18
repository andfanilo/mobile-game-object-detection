<template>
  <div class="panel">
    <div class="panel__content">
      <h1>Welcome to the mobile game object detector !</h1>
      <p>Our model can recognize up to 110 different objects. How many can you detect in 90 seconds ?</p>
      <p>
        <input v-model="name" placeholder="Enter your name" />
      </p>
      <transition name="error">
        <p class="error" v-show="errorMessage != ''">{{errorMessage}}</p>
      </transition>
      <button
        class="panel__content__play"
        :disabled="name === ''"
        v-on:click="handleClick(name)"
      >Play</button>
    </div>
  </div>
</template> 

<script>
export default {
  name: "NamePanel",
  data() {
    return {
      name: "",
      errorMessage: ""
    };
  },
  methods: {
    handleClick(name) {
      this.$emit("start-game", name);
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

.error {
  padding: 3px;
  color: #fcfcfc;
  background-color: red;
}

.error-enter-active,
.error-leave-active {
  transition: opacity 0.5s;
}
.error-enter, .error-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
