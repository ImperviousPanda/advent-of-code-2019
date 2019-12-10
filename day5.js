const fs = require('fs');

const main = async () => {


    let input = fs.readFileSync('day5input.txt').toString().split(',');
    getOutput(input);


};

const getOutput = (input) => {

    let index = 0;
    let running = true;
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
        const operation = String(instruction).substr(3, 5);

        if (operation === '01') {
            let firstNum = firstNumMode === '0' ? Number(input[firstNumIndex]) : firstNumIndex;
            let secondNum = secondNumMode === '0' ? Number(input[secondNumIndex]) : secondNumIndex;
            input[answerPosition] = firstNum + secondNum;
            index = index + 4;
        } else if (operation === '02') {
            let firstNum = firstNumMode === '0' ? Number(input[firstNumIndex]) : firstNumIndex;
            let secondNum = secondNumMode === '0' ? Number(input[secondNumIndex]) : secondNumIndex;
            input[answerPosition] = firstNum * secondNum;
            index = index + 4;
        } else if (operation === '03') {
            input[firstNumIndex] = 5;
            index = index + 2;
        } else if (operation === '04') {
            let firstNum = firstNumMode === '0' ? Number(input[firstNumIndex]) : firstNumIndex;
            console.log(firstNum);
            index = index + 2;
        } else if (operation === '99') {
            running = false;
        } else if (operation === '05') {
            let firstNum = firstNumMode === '0' ? Number(input[firstNumIndex]) : firstNumIndex;
            let secondNum = secondNumMode === '0' ? Number(input[secondNumIndex]) : secondNumIndex;
            if (Number(firstNum) !== 0) {
                index = secondNum;
            } else {
                index = index + 3;
            }
        } else if (operation === '06') {
            let firstNum = firstNumMode === '0' ? Number(input[firstNumIndex]) : firstNumIndex;
            let secondNum = secondNumMode === '0' ? Number(input[secondNumIndex]) : secondNumIndex;

            if (Number(firstNum) === 0) {
                index = secondNum;
            } else {
                index = index + 3;
            }
        } else if (operation === '07') {
            let firstNum = firstNumMode === '0' ? Number(input[firstNumIndex]) : firstNumIndex;
            let secondNum = secondNumMode === '0' ? Number(input[secondNumIndex]) : secondNumIndex;
            input[answerPosition] = Number(firstNum) < Number(secondNum) ? 1 : 0;
            index = index + 4;
        } else if (operation === '08') {
            let firstNum = firstNumMode === '0' ? Number(input[firstNumIndex]) : firstNumIndex;
            let secondNum = secondNumMode === '0' ? Number(input[secondNumIndex]) : secondNumIndex;
            input[answerPosition] = Number(firstNum) === Number(secondNum) ? 1 : 0;
            index = index + 4;
        } else {
            throw new Error('bad instruction' + operation);
        }
    }

    return input[0];

};

main();
