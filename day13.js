const fs = require('fs');

const main = async () => {


  let input = fs.readFileSync('day13input.txt').toString().split(',');
  input[0] = 2;


  const output = getOutput(input);

  let numblocks = 0;
  // for (const tile of output) {
  //   if (tile.type === 2) {
  //     numblocks++;
  //   }
  // }
  //
  // console.log(numblocks);

};

const getOutput = (program) => {
  const matrix = [];
  let tile = [];
  let index = 0;
  let running = true;
  let relativeBase = 0;
  while (running) {

    let instruction = String(program[index]);
    const firstNumIndex = Number(program.length > index+1 ? program[index+1] : null);
    const secondNumIndex = Number(program.length > index+2 ? program[index+2] : null);
    const answerPosition = Number(program.length > index+3 ? program[index+3] : null);

    while (instruction.length < 5) {
      instruction = '0' + String(instruction);
    }

    const firstNumMode = instruction[2];
    const secondNumMode = instruction[1];
    const answerPositionMode = instruction[0];
    const operation = String(instruction).substr(3, 5);

    if (operation === '01') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(program, secondNumIndex, secondNumMode, relativeBase);
      program[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = firstNum + secondNum;
      index = index + 4;
    } else if (operation === '02') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(program, secondNumIndex, secondNumMode, relativeBase);
      program[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = firstNum * secondNum;
      index = index + 4;
    } else if (operation === '03') {
      printMatrix(matrix);

      const ballX = Number(getBallX(matrix));
      const paddleX = Number(getPaddleX(matrix));

      let direction;
      if (ballX < paddleX) {
        direction = -1;
      } else if (ballX > paddleX) {
        direction = 1;
      } else {
        direction = 0;
      }

      program[getAnswerPosition(firstNumIndex, firstNumMode, relativeBase)] = direction;
      index = index + 2;
    } else if (operation === '04') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      tile.push(firstNum);

      if (tile.length === 3) {
        if (Number(tile[0]) === -1 && Number(tile[1]) === 0) {
          console.log('SCORE IS ', tile[2]);
        } else {
          addPointToMatrix(matrix, [tile[0], tile[1]], tile[2]);
        }
        tile = [];
      }

      index = index + 2;
    } else if (operation === '99') {
      running = false;
    } else if (operation === '05') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(program, secondNumIndex, secondNumMode, relativeBase);
      if (Number(firstNum) !== 0) {
        index = secondNum;
      } else {
        index = index + 3;
      }
    } else if (operation === '06') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(program, secondNumIndex, secondNumMode, relativeBase);

      if (Number(firstNum) === 0) {
        index = secondNum;
      } else {
        index = index + 3;
      }
    } else if (operation === '07') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(program, secondNumIndex, secondNumMode, relativeBase);
      program[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = Number(firstNum) < Number(secondNum) ? 1 : 0;
      index = index + 4;
    } else if (operation === '08') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      const secondNum = getValueWithMode(program, secondNumIndex, secondNumMode, relativeBase);
      program[getAnswerPosition(answerPosition, answerPositionMode, relativeBase)] = Number(firstNum) === Number(secondNum) ? 1 : 0;
      index = index + 4;
    } else if (operation === '09') {
      const firstNum = getValueWithMode(program, firstNumIndex, firstNumMode, relativeBase);
      relativeBase = relativeBase + firstNum;
      index = index + 2;
    } else {
      throw new Error('bad instruction' + operation);
    }
  }
};

const addPointToMatrix = (matrix, point, item) => {
  const x = Number(point[0]);
  const y = Number(point[1]);

  if (!matrix[y]) {
    let xArray = [];
    xArray[x] = item;
    matrix[y] = xArray;
  } else {
    matrix[y][x] = item;
  }

  return matrix;
}

const getTileType = (tile) => {
  if (tile === 0) {
    return ' ';
  } else if (tile === 1) {
    return '|';
  } else if (tile === 2) {
    return '=';
  } else if (tile === 3) {
    return '_';
  } else if (tile === 4) {
    return 'O';
  } else {
    throw new Error('weird tile type ' + tile);
  }
}

const getBallX = (matrix) => {
  return getXOfType(matrix, 4);
}

const getPaddleX = (matrix) => {
  return getXOfType(matrix, 3);
}

const getXOfType = (matrix, type) => {
  for (const xArray in matrix) {
    for (const item in matrix[xArray]) {
      if (matrix[xArray][item] === type) {
        return item;
      }
    }
  }
  throw Error('didnt find item of type ' + type);
}


const printMatrix = (matrix) => {
  for (const xarray of matrix) {
    let output = '';
    for (const xItem of xarray) {
      output = output + getTileType(xItem);
    }
    console.log(output);
  }
}

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
