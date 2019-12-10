const fs = require('fs');

const main = () => {
  const input = fs.readFileSync('day8input.txt').toString();

  const numPixels = 25*6;
  const numLayers = input.length/numPixels;
  const layers = [];

  for (let i = 0; i < numLayers; i = i + 1) {
    const oneLayer = input.substr(i * numPixels, numPixels);
    layers.push(oneLayer);
  }

  let currentImage = null;
  for (const layer of layers) {
    if (currentImage === null) {
      currentImage = layer;
      continue;
    }

    for (let i = 0; i < numPixels; i++) {
      if (currentImage[i] === '2' && layer[i] !== '2') {
        currentImage = replaceAt(currentImage, i, layer[i]);
      }
    }
  }

  for (let i = 0; i < 6; i++) {
    console.log(currentImage.substr(i*25, 25));
  }

};

const replaceAt = (text, index, replacement) => {
  return text.substr(0, index) + replacement+ text.substr(index + replacement.length);
}

main();