const fs = require('fs');

const main = async () => {

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      let input = fs.readFileSync('day2input.txt').toString().split(',').map(item => { return Number(item) });

      input[1] = noun
      input[2] = verb
    
      output = getOutput(input);

      if (output === 19690720) {
        console.log('noun', noun, 'verb', verb);
        console.log('HERE')
        process.exit(1)
      }
    }


  }

}

const getOutput = (input) => {

  let index = 0;
  while (Number(input[index]) != 99) {
    
    const instruction = input[index]
    const firstNumIndex = input[index+1]
    const secondNumIndex = input[index+2]
    const answerPosition = input[index+3]
    
    if (instruction === 1) {
      input[answerPosition] = input[firstNumIndex] + input[secondNumIndex];
    } else if (instruction === 2) {
      input[answerPosition] = input[firstNumIndex] * input[secondNumIndex];
    } else {
      throw new Error('bad instruction' + instruction);
    }

    index = index + 4;

  }

  return input[0];

}

main();
