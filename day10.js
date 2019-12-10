const fs = require('fs');

const main = () => {
  const input = fs.readFileSync('day10input.txt').toString();

  const lines = input.split('\n');

  const pointsList = getAsteroidPoints(lines);

  let highestAsteroids = 0;
  let highestAsteroidsPoint = null;
  // for each, calculate the number of asteroids it can see
  for (const point of pointsList) {
    const numVisible = getNumVisiblePoints(point, pointsList);
    if (numVisible > highestAsteroids) {
      highestAsteroids = numVisible;
      highestAsteroidsPoint = point;
    }
  }

  console.log(highestAsteroidsPoint, highestAsteroids);

};

const getNumVisiblePoints = (point, points) => {

  let numVisiblePoints = 0;
  for (const currPoint of points) {
    if (currPoint[0] === point[0] && currPoint[1] === point[1]) {
      continue;
    }

    const isVisible = getIsVisible(point, currPoint, points);
    if (isVisible) numVisiblePoints++;
  }

  return numVisiblePoints;

}

const getIsVisible = (point1, point2, points) => {
  // See if there are any points exactly between these two
  for (const point of points) {
    // Are they on the same line?  if not, disregard.
    if (point[0] === point1[0] && point[1] === point1[1]) continue;
    if (point[0] === point2[0] && point[1] === point2[1]) continue;

    const crossProduct = (point[1] - point1[1]) * (point2[0] - point1[0]) - (point[0] - point1[0]) * (point2[1] - point1[1]);
    if (crossProduct !== 0) continue;

    const dotProduct = (point[0] - point1[0]) * (point2[0] - point1[0]) + (point[1] - point1[1]) * (point2[1] - point1[1]);
    if (dotProduct < 0) continue;

    const squaredLengthBa = (point2[0] - point1[0])*(point2[0] - point1[0]) + (point2[1] - point1[1])*(point2[1] - point1[1]);
    if (dotProduct > squaredLengthBa) continue;

    return false;
  }

  return true;
};

const getAsteroidPoints = (points) => {
  const returnPoints = [];
  for (const index in points) {
    const y = index;
    for (const charIndex in points[index]) {
      if (points[index][charIndex] === '#') {
        const x = charIndex;
        returnPoints.push([Number(x), Number(y)]);
      }
    }
  }
  return returnPoints;
};

main();