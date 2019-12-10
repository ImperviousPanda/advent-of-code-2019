const fs = require('fs');

const main = async () => {


  let input = fs.readFileSync('day9input.txt').toString().split(',');
  getOutput(input);


};

const getOutput = (input) => {

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
      input[getAnswerPosition(firstNumIndex, firstNumMode, relativeBase)] = 2;
      index = index + 2;
    } else if (operation === '04') {
      const firstNum = getValueWithMode(input, firstNumIndex, firstNumMode, relativeBase);
      console.log(firstNum);
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

  return input[0];

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
