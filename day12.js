const fs = require('fs');
const math = require('math');

const main = async () => {

  const input = fs.readFileSync('day12input.txt').toString();
  const lines = input.split('\n');
  const moons = [];

  let id = 0;
  for (const line of lines) {
    const position = [];
    const items = line.replace('<', '')
      .replace('>', '')
      .split(', ');

    for (const item of items) {
      position.push(item.split('=')[1]);
    }

    moons.push({ id, point: position, velocity: [0, 0, 0] });
    id++;
  }

  const cyclePoint = getCyclePoint(moons);
  cyclePoint.found = {};

  let keepCycling = true;
  let iteration = 1;
  while (keepCycling) {
    iteration++;

    applyGravity(moons);
    applyVelocity(moons);
    checkIfAtCyclePoint(cyclePoint, moons, iteration);
    keepCycling = !allCycleTimesFound(cyclePoint);
  }

  const finalValue = lcm(cyclePoint.found[2], lcm(cyclePoint.found[1], cyclePoint.found[0]));
  console.log(finalValue);
}

const getCyclePoint = (positions) => {
  const cyclePoint = { 0: [], 1: [], 2: []};
  for (const item of positions) {
    cyclePoint[Number(0)].push(Number(item.point[0]));
    cyclePoint[Number(1)].push(Number(item.point[1]));
    cyclePoint[Number(2)].push(Number(item.point[2]));
  }
  return cyclePoint;
}

const checkIfEqual = (aItems, bItems) => {
  const equal = JSON.stringify(aItems) === JSON.stringify(bItems);
  return equal;
}

const calculateEnergy = (items) => {
  let energy = 0;

  for (const item of items) {
    const potential = Number(Math.abs(item.point[0]) + Math.abs(item.point[1]) + Math.abs(item.point[2]));
    const kinetic = Number(Math.abs(item.velocity[0]) + Math.abs(item.velocity[1]) + Math.abs(item.velocity[2]));

    energy = energy + kinetic * potential;
  }

  return energy;
}

const allCycleTimesFound = cyclePoint => {
  return Object.keys(cyclePoint.found).length === 3
}

const checkIfAtCyclePoint = (cyclePoint, items, iteration) => {
  const newCyclePoint = getCyclePoint(items);

  const keys = Object.keys(newCyclePoint);
  for (const key of keys) {
    if (!cyclePoint.found[key] && checkIfEqual(cyclePoint[key], newCyclePoint[key])) {
      cyclePoint.found[key] = iteration;
    }
  }
}

const applyVelocity = (items) => {
  for (const item of items) {
    item.point[0] = Number(item.point[0]) + Number(item.velocity[0]);
    item.point[1] = Number(item.point[1]) + Number(item.velocity[1]);
    item.point[2] = Number(item.point[2]) + Number(item.velocity[2]);
  }
}

const lcm = (a, b) => {
  return (Number(a) * Number(b)) / math.gcd(a, b)
}

const applyGravity = (items) => {
  for (const item of items) {
    updateOneGravity(item, items);
  }
  return items;
}

const updateOneGravity = (point, items) => {
  for (const item of items) {
    if (point.id === item.id) continue;

    updateOneCoordinate(point, item, 0);
    updateOneCoordinate(point, item, 1);
    updateOneCoordinate(point, item, 2);
  }
};

const updateOneCoordinate = (a, b, index) => {
  if (a.point[index] !== b.point[index]) {
    const onePosition = Number(a.point[index]);
    const twoPosition = Number(b.point[index]);

    // move each gravity one closer to the other one
    if (onePosition < twoPosition) {
      a.velocity[index] = a.velocity[index] + 1;
    } else if (onePosition > twoPosition) {
      a.velocity[index] = a.velocity[index] - 1;
    }
  }
}

main();