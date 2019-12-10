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

  const monitoringStation = highestAsteroidsPoint;

  const lineLists = makeLines(pointsList, monitoringStation);
  lineLists.forEach(list => {
    list.sort((a, b) => {
      //a2 + b2 = c2
      const distance1 = Math.sqrt(Math.pow(a[0] - monitoringStation[0], 2) + Math.pow(a[1] - monitoringStation[1], 2));
      const distance2 = Math.sqrt(Math.pow(b[0] - monitoringStation[0], 2) + Math.pow(b[1] - monitoringStation[1], 2));

      return distance1 - distance2;
    });
  });

  const linesWithDegrees = constructDegrees(lineLists, monitoringStation);
  linesWithDegrees.sort((a, b) => {
    let distance1 = a.degrees - 90;
    if (a.degrees < 90) {
      distance1 = a.degrees + 270;
    }
    let distance2 = b.degrees - 90;
    if (b.degrees < 90) {
      distance2 = b.degrees + 270;
    }

    return distance1 - distance2;
  });

  let numDestroyed = 0;
  let index = 0;
  let previousDestroyed = null;
  while (numDestroyed < 200) {
    if (index >= linesWithDegrees.length) {
      index = 0;
    }
    if (!linesWithDegrees[index]) continue;

    const line = linesWithDegrees[index];
    previousDestroyed = line.points[0];
    line.points.shift();
    numDestroyed++;

    if (line.points.length === 0) {
      linesWithDegrees[index] = null;
    }
    index++;
  }

  console.log(previousDestroyed);
};

const calculateDegrees = (center, end) => {
  const dy = end[1] - center[1];
  const dx = end[0] - center[0];
  let theta = Math.atan(dy/dx);
  theta *= 180 / Math.PI;

  return theta;
}

const constructDegrees = (lines, center) => {
  const linesWithDegrees = [];

  for (const line of lines) {
    const point = line[0];

    let theta = calculateDegrees(center, point);

    if (theta < 0) {
      theta = theta + 360;
    }

    linesWithDegrees.push({ degrees: theta, points: line });
  }
  return linesWithDegrees;
}

const makeLines = (list, point1) => {
  const lines = [];

  for (const point of list) {
    if (point[0] === point1[0] && point[1] === point1[1]) continue;

    let lineNotFound = true;
    for (let i = 0; i < lines.length && lineNotFound; i++) {
      const point2 = lines[i][0];

      const crossProduct = (point[1] - point1[1]) * (point2[0] - point1[0]) - (point[0] - point1[0]) * (point2[1] - point1[1]);
      if (crossProduct === 0) {
        // make sure theyre going the same way

        const pointXFromCenter = point[0] - point1[0];
        const pointYFromCenter = point[1] - point1[1];

        const xFromCenter = point2[0] - point1[0];
        const yFromCenter = point2[1] - point1[1];

        if ((pointXFromCenter*xFromCenter) > 0 && (pointYFromCenter*yFromCenter) > 0) {
          lines[i].push(point);
          lineNotFound = false;
        }
      }
    }

    if (lineNotFound) {
      lines.push([point]);
    }
  }
  return lines;
}

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