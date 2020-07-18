<template>
  <div>
    <svg :height="height" :width="width" :viewBox="viewBox" preserveAspectRatio="none">
      <rect
        v-for="zone in zones"
        :key="`${zone.label}-frame-${zone.bbox.x1}-${zone.bbox.y1}`"
        :x="zone.bbox.x1"
        :y="zone.bbox.y1"
        :width="zone.bbox.x2 - zone.bbox.x1"
        :height="zone.bbox.y2 - zone.bbox.y1"
        :stroke="`rgb(${zone.bbox.color})`"
        stroke-width="3"
        fill-opacity="0"
      />
      <rect
        v-for="zone in zones"
        :key="`${zone.label}-textBox-${zone.bbox.x1}-${zone.bbox.y1}`"
        :x="zone.bbox.x1"
        :y="zone.bbox.y1"
        :width="zone.bbox.x2 - zone.bbox.x1"
        :height="textBoxHeight"
        :fill="`rgb(${zone.bbox.color})`"
      />
      <text
        v-for="zone in zones"
        v-bind:key="`${zone.label}-label-${zone.bbox.x1}-${zone.bbox.y1}`"
        v-bind:x="zone.bbox.x1"
        v-bind:y="zone.bbox.y1 + textBoxHeight"
      >{{`${zone.label}:${zone.confidence.toFixed(2)}`}}</text>
    </svg>
  </div>
</template>

<script>
export default {
  name: "ZonesFrame",
  props: { height: Number, width: Number, viewBox: String, zones: Array },
  data() {
    return {
      textBoxHeight: 14 // height of text displayed in svg
    };
  }
};
</script>

<style scoped>
</style>