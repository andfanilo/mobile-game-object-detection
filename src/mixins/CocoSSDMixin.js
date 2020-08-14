import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
//import "@tensorflow/tfjs-backend-webgl";

export default {
  data() {
    return {
      model: undefined, // store coco-ssd model there
    };
  },
  mounted() {
    cocoSsd.load({ base: 'lite_mobilenet_v2' }).then((loadedModel) => {
      this.$emit('model-loaded');
      this.model = loadedModel;
    });
  },
};
