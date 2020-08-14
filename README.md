# Object detection game

> The demo was initially YOLOv3 behind a Flask server on GPU, and the Vue frontend hitting the backend for predictions. I wanted to try everything in the browser, so using CocoSSD instead and did a lot of refactoring to actually isolate logic in multiple components, but the inference is really slow on my computer...so right now I'm putting this project on pause.

Detect a maximum of objects the model can detect, in a minimum of time.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### References

- [TensorFlow.js — Real-Time Object Detection in 10 Lines of Code](https://hackernoon.com/tensorflow-js-real-time-object-detection-in-10-lines-of-code-baf15dfb95b2)
- [TensorFlow.js: Make a smart webcam in JavaScript with a pre-trained Machine Learning model](https://codelabs.developers.google.com/codelabs/tensorflowjs-object-detection/#0)
- [In-Browser Object Detection Using Tensorflow.js](https://nanonets.com/blog/object-detection-tensorflow-js/)