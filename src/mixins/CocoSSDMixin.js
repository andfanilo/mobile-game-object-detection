import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

export default {
  data() {
    return {
      model: undefined, // store coco-ssd model there
    };
  },
  methods: {
    predictZones(videoEl) {
      alert(videoEl);
    },
  },
  mounted() {
    cocoSsd.load().then((loadedModel) => {
      this.$emit('model-loaded');
      this.model = loadedModel;
    });
  },
};
