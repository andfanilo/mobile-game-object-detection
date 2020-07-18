<template>
  <div class="container">
    <transition-group name="word-list" class="word-list" tag="ul">
      <li class="word-list__item" v-for="word in words" v-bind:key="word">{{ word }}</li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "AnimatedWordList",
  props: { words: Array }
};
</script>

<style scoped>
.container {
  background-color: #0066a1;
  color: #fcfcfc;
}

.word-list {
  white-space: nowrap;
}

.word-list__item {
  display: inline-block;
  margin-right: 2em;
}

.word-list-enter-active,
.word-list-leave-active {
  transition: all 1s;
}

.word-list-enter,
.word-list-leave-to {
  opacity: 0;
}

.word-list-move {
  transition: transform 1s;
}
</style>