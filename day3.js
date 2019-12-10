const _ = require('underscore');
const fs = require('fs');

const intersection = (a, b) => {

    const intersecting = [];

    const keys1 = Object.keys(a);
    const keys2 = Object.keys(b);

    console.log('number of items ', keys1.length, keys2.length);

    for (const key1 of keys1) {
        for (const key2 of keys2) {
            if (key1 === key2 && key1 !== '0:0') {
                intersecting.push([a[key1], b[key2]]);
                console.log('adding to interesecting ', key1, key2);
            }
        }
    }
    return intersecting;

};

const getPoints = (wire) => {
    const directions = wire.split(',');

    const pointsMap = {};
    let currentPoint = { point: [0, 0], numSteps: 0 };
    pointsMap['0:0'] = currentPoint;

    for (const direction of directions) {
        const number = direction.substr(1, direction.length);
        const letter = direction.substr(0, 1);

        if (letter === 'R') {
            for (let i = 0; i < number; i++) {
                const x = currentPoint.point[0] + 1;
                const y = currentPoint.point[1];
                currentPoint = {point: [x, y], numSteps: currentPoint.numSteps + 1};
                addPoint(pointsMap, currentPoint);
            }
        } else if (letter === 'L') {
            for (let i = 0; i < number; i++) {
                const x = currentPoint.point[0] - 1;
                const y = currentPoint.point[1];
                currentPoint = {point: [x, y], numSteps: currentPoint.numSteps + 1};
                addPoint(pointsMap, currentPoint);
            }
        } else if (letter === 'D') {
            for (let i = 0; i < number; i++) {
                const x = currentPoint.point[0];
                const y = currentPoint.point[1] - 1;
                currentPoint = {point: [x, y], numSteps: currentPoint.numSteps + 1};
                addPoint(pointsMap, currentPoint);
            }
        } else if (letter === 'U') {
            for (let i = 0; i < number; i++) {
                const x = currentPoint.point[0];
                const y = currentPoint.point[1] + 1;
                currentPoint = {point: [x, y], numSteps: currentPoint.numSteps + 1};
                addPoint(pointsMap, currentPoint);
            }
        }
    }

    return pointsMap;
};

const addPoint = (map, point) => {
    const key = point.point[0] + ':' + point.point[1];
    if (map[key] && map[key].numSteps > point.numSteps) {
        map[key] = point;
    } else if (!map[key]) {
        map[key] = point;
    }
};

const main = () => {
    const testInput = fs.readFileSync('day3input.txt').toString();

    const wires = testInput.split('\n');
    const wire1 = wires[0];
    const wire2 = wires[1];

    console.log("Getting first points map");
    const pointsMap1 = getPoints(wire1);
    console.log("getting second points map");
    const pointsMap2 = getPoints(wire2);

    console.log("getting intersecting points");
    const intersectingPoints = intersection(pointsMap1, pointsMap2);
    console.log("intersecting points", intersectingPoints);

    let lowest = null;
    let points = null;
    for (const pointArr of intersectingPoints) {
        const distance = pointArr[0].numSteps + pointArr[1].numSteps;
        if (lowest === null || distance < lowest) {
            lowest = distance;
            points = pointArr;
        }
    }

    console.log('LOWEST', lowest, JSON.stringify(points));
};

main();