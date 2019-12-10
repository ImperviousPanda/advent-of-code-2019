const fs = require('fs');

const main = () => {

  const testInput = fs.readFileSync('day6input.txt').toString();

  const items = testInput.split('\n');
  let currItem = items[0].split(')');

  const itemMap = {};

  for (let i = 0; i < items.length; i++) {
    currItem = items[i].split(')');
    const newNode = { name: currItem[0], children: [] };
    const anotherNode = { name: currItem[1], children: [] };
    itemMap[currItem[0]] = newNode;
    itemMap[currItem[1]] = anotherNode;
  }

  for (let i = 0; i < items.length; i++) {
    currItem = items[i].split(')');

    let childNode = itemMap[currItem[1]];
    childNode.parent = itemMap[currItem[0]];
    itemMap[currItem[0]].children.push(childNode);
  }

  const keys = Object.keys(itemMap);
  let orbits = 0;
  for (const key of keys) {
    let currNode = itemMap[key];
    while (currNode.parent) {
      currNode = currNode.parent;
      orbits = orbits + 1;
    }
  }

  // find the lowest shared parent between you and SAN
  let youParents = [];
  let youNodePath = itemMap['YOU'];
  while (youNodePath.parent) {
    youNodePath = youNodePath.parent;
    youParents.push(youNodePath.name);
  }
  console.log(youParents);

  let sanParents = [];
  let sanNodePath = itemMap['SAN'];
  while(sanNodePath.parent) {
    sanNodePath = sanNodePath.parent;
    sanParents.push(sanNodePath.name);
  }

  console.log(sanParents);

  const lowestParent = findLowestParent(youParents, sanParents);
  console.log('lowest parent ', lowestParent);

  const indexInYou = youParents.indexOf(lowestParent);
  const indexInSan = sanParents.indexOf(lowestParent);
  console.log(indexInSan + indexInYou - 1);
}

const findLowestParent = (arr1, arr2) => {
  const map = {};
  let distance = 1;
  for (const item of arr1) {
    map[item] = distance;
    distance = distance + 1;
  }

  distance = 1;
  let lowest;
  let lowestParent;
  for (const item of arr2) {
    if (map[item]) {
      const totaldistance = map[item] + distance;

      if (!lowest) {
        lowestParent = item;
        lowest = totaldistance
      } else if (totaldistance < lowest) {
        lowestParent = item;
        lowest = totaldistance
      }
    }
    distance = distance + 1;
  }

  return lowestParent;
}

main();