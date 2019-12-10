const fs = require('fs');

const main = async () => {
  // first input is phase setting, second is the input from the last thing.

  const options = [9, 8, 7, 6, 5];
  const combinations = getCombinations(options);
  let highest = 0;
  const promises = [];
  let program;

  const amplifiers = ['A', 'B', 'C', 'D', 'E'];

  for (const combination of combinations) {
    const outputMap = {};

    for (let i = 0; i < amplifiers.length; i++) {
      outputMap[amplifiers[i]] = {output: [], phase: combination[i]};
      if (amplifiers[i] === 'E') {
        outputMap[amplifiers[i]].output.push(0);
      }
    }

    for (let i = 0; i < amplifiers.length; i++) {
      program = fs.readFileSync('day7input.txt').toString().split(',');
      promises.push(getOutput(program, amplifiers[i], outputMap));
    }

    await Promise.all(promises);
    const finalNum = outputMap['E'].output[outputMap['E'].output.length - 1];
    console.log("GOT A NUM ", finalNum);
    if (finalNum > highest) {
      highest = finalNum;
    }
  }
  console.log('highestNum is ', highest);
};

const getCombinations = (list) => {
  if (list.length === 1) {
    const newList = [list];
    return newList;
  }
  const combinations = [];

  for (let i = 0; i < list.length; i++) {
    const firstItem = list[i];

    const leftOverList = list.slice(0);
    leftOverList.splice(i, 1);

    const lists = getCombinations(leftOverList);

    for (const item of lists) {
      let newList = [firstItem];
      combinations.push(newList.concat(item));
    }
  }

  return combinations;
}

const getOutput = async (program, amplifier, outputMap) => {

  return new Promise(async (resolve) => {

    let inputList;
    if (amplifier === 'A') {
      inputList = outputMap['E'].output;
    } else if (amplifier === 'B') {
      inputList = outputMap['A'].output;
    } else if (amplifier === 'C') {
      inputList = outputMap['B'].output;
    } else if (amplifier === 'D') {
      inputList = outputMap['C'].output;
    } else if (amplifier === 'E') {
      inputList = outputMap['D'].output;
    }

    let index = 0;
    let running = true;
    let inputParam = 0;
    while (running) {
      let instruction = String(program[index]);
      const firstNumIndex = Number(program.length > index + 1 ? program[index + 1] : null);
      const secondNumIndex = Number(program.length > index + 2 ? program[index + 2] : null);
      const answerPosition = Number(program.length > index + 3 ? program[index + 3] : null);

      while (instruction.length < 5) {
        instruction = '0' + String(instruction);
      }

      const firstNumMode = instruction[2];
      const secondNumMode = instruction[1];
      const operation = String(instruction).substr(3, 5);

      if (operation === '01') {
        let firstNum = firstNumMode === '0' ? Number(program[firstNumIndex]) : firstNumIndex;
        let secondNum = secondNumMode === '0' ? Number(program[secondNumIndex]) : secondNumIndex;
        program[answerPosition] = firstNum + secondNum;
        index = index + 4;
      } else if (operation === '02') {
        let firstNum = firstNumMode === '0' ? Number(program[firstNumIndex]) : firstNumIndex;
        let secondNum = secondNumMode === '0' ? Number(program[secondNumIndex]) : secondNumIndex;
        program[answerPosition] = firstNum * secondNum;
        index = index + 4;
      } else if (operation === '03') {
        if (inputParam === 0) {
          program[firstNumIndex] = outputMap[amplifier].phase;
          inputParam = inputParam + 1;
          index = index + 2;
          continue;
        }

        while (inputList.length < inputParam) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        program[firstNumIndex] = inputList[inputParam - 1];
        inputParam = inputParam + 1;
        index = index + 2;

      } else if (operation === '04') {
        let firstNum = firstNumMode === '0' ? Number(program[firstNumIndex]) : firstNumIndex;
        outputMap[amplifier].output.push(firstNum);
        index = index + 2;
      } else if (operation === '99') {
        return resolve();
      } else if (operation === '05') {
        let firstNum = firstNumMode === '0' ? Number(program[firstNumIndex]) : firstNumIndex;
        let secondNum = secondNumMode === '0' ? Number(program[secondNumIndex]) : secondNumIndex;
        if (Number(firstNum) !== 0) {
          index = secondNum;
        } else {
          index = index + 3;
        }
      } else if (operation === '06') {
        let firstNum = firstNumMode === '0' ? Number(program[firstNumIndex]) : firstNumIndex;
        let secondNum = secondNumMode === '0' ? Number(program[secondNumIndex]) : secondNumIndex;

        if (Number(firstNum) === 0) {
          index = secondNum;
        } else {
          index = index + 3;
        }
      } else if (operation === '07') {
        let firstNum = firstNumMode === '0' ? Number(program[firstNumIndex]) : firstNumIndex;
        let secondNum = secondNumMode === '0' ? Number(program[secondNumIndex]) : secondNumIndex;
        program[answerPosition] = Number(firstNum) < Number(secondNum) ? 1 : 0;
        index = index + 4;
      } else if (operation === '08') {
        let firstNum = firstNumMode === '0' ? Number(program[firstNumIndex]) : firstNumIndex;
        let secondNum = secondNumMode === '0' ? Number(program[secondNumIndex]) : secondNumIndex;
        program[answerPosition] = Number(firstNum) === Number(secondNum) ? 1 : 0;
        index = index + 4;
      } else {
        throw new Error('bad instruction ' + operation);
      }
    }
  });

};

main();
