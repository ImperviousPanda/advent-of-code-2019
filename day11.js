const fs = require('fs');

const main = async () => {


  let input = fs.readFileSync('day11input.txt').toString().split(',');
  getOutput(input);


};

const getOutput = (input) => {

  const colorMap = {};
  let colorPoint = [0, 0];

  let settingColor = true;
  let direction = 90;

  let index = 0;
  let running = true;
  let relativeBase = 0;
  while (running) {

    let instruction = String(input[index]);
    const firstNumIndex = Number(input.length > index+1 ? input[index+1] : null);
    const secondNumIndex = Number(input.length > index+2 ? input[index+2] : null);
    const answerPosition = Number(input.length > index+3 ? input[index+3] : null);

    while (instruction.length < 5) {
      instruction = '0' + String(instruction);
    }

    const firstNumMode = instruction[2];
    const secondNumMode = instruction[1];
    const answerPositionMode = instruction[0];
    const operation = String(instruction).substr(3, 5);

    if (operation === '01') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(input, secondNumIndex, secondNumMode, relativeBase);
      input[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = firstNum + secondNum;
      index = index + 4;
    } else if (operation === '02') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(input, secondNumIndex, secondNumMode, relativeBase);
      input[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = firstNum * secondNum;
      index = index + 4;
    } else if (operation === '03') {
      // different input
      let value = colorMap[colorPoint[0] + ':' + colorPoint[1]];
      if (!value) value = 1;

      input[getAnswerPosition(firstNumIndex, firstNumMode, relativeBase)] = value;
      index = index + 2;
    } else if (operation === '04') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);

      if (settingColor) {
        colorMap[colorPoint[0] + ':' + colorPoint[1]] = Number(firstNum);
      } else {
        direction = updateDirection(firstNum, direction);
        colorPoint = moveOne(direction, colorPoint);
      }

      settingColor = !settingColor;
      index = index + 2;
    } else if (operation === '99') {
      running = false;
    } else if (operation === '05') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(input, secondNumIndex, secondNumMode, relativeBase);
      if (Number(firstNum) !== 0) {
        index = secondNum;
      } else {
        index = index + 3;
      }
    } else if (operation === '06') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(input, secondNumIndex, secondNumMode, relativeBase);

      if (Number(firstNum) === 0) {
        index = secondNum;
      } else {
        index = index + 3;
      }
    } else if (operation === '07') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(input, secondNumIndex, secondNumMode, relativeBase);
      input[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = Number(firstNum) < Number(secondNum) ? 1 : 0;
      index = index + 4;
    } else if (operation === '08') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(input, secondNumIndex, secondNumMode, relativeBase);
      input[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = Number(firstNum) === Number(secondNum) ? 1 : 0;
      index = index + 4;
    } else if (operation === '09') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      relativeBase = relativeBase + firstNum;
      index = index + 2;
    } else {
      throw new Error('bad instruction' + operation);
    }
  }

  console.log('num painted ', Object.keys(colorMap).length);

  printGrid(colorMap);

  return input[0];

};

const printGrid = (colorMap) => {
  const keys = Object.keys(colorMap);
  const xValues = Array.from(new Set(keys.map(key => {
    return Number(key.split(':')[0]);
  })));
  const yValues = Array.from(new Set(keys.map(key => {
    return Number(key.split(':')[1]);
  })));

  for (let y = Math.min(...yValues); y <= Math.max(...yValues); y++) {
    let oneLine = '';
    for (let x = Math.min(...xValues); x <= Math.max(...xValues); x++) {
      const key = x + ':' + y;
      if (colorMap[key] === 'undefined') {
        oneLine = oneLine + ' ' + '|';
      } else {
        oneLine = oneLine + ' ' + (colorMap[key] === 1 ? '|' : 'o');
      }
    }
    console.log(oneLine);
  }

}

const moveOne = (direction, colorPoint) => {
  if (direction === 0) {
    return [colorPoint[0] - 1, colorPoint[1]];
  } else if (direction === 90) {
    return [colorPoint[0], colorPoint[1] + 1]
  } else if (direction === 180) {
    return [colorPoint[0] + 1, colorPoint[1]];
  } else if (direction === 270) {
    return [colorPoint[0], colorPoint[1] - 1];
  }
};

const updateDirection = (num, direction) => {
  let change;
  if (num === 0) {
    change = -90;
  } else if (num === 1) {
    change = 90;
  } else {
    throw new Error('invalid direction change ' + num);
  }

  let newDirection = direction + change;
  if (newDirection < 0) {
    newDirection = newDirection + 360;
  } else if (newDirection >= 360) {
    newDirection = newDirection - 360;
  }

  return newDirection;
};

const getAnswerPosition = (index, mode, relativeBase) => {
  if (mode === '0') {
    return index;
  } else if (mode === '2') {
    return relativeBase + index;
  } else {
    throw new Error('the answer mode is weird ' + mode);
  }
}

const getValueWithMode = (program, index, mode, relativeBase) => {
  if (mode === '0') {
    if (index >= program.length) {
      return 0;
    } else {
      return Number(program[index]);
    }
  } else if (mode === '1') {
    return Number(index);
  } else if (mode === '2') {
    let nextIndex = index + relativeBase;
    if (nextIndex >= program.length) {
      return 0;
    } else {
      return Number(program[nextIndex]);
    }
  }
}


main();
