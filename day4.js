
const main = () => {

    const min = 123257;
    const max = 647015;

    let possibilities = 0;
    for (let i = min; i < max + 1; i++) {
        console.log('on num ', i);
        if (hasDoubleDigits(i) && hasDecreasingDigits(i)) {
            possibilities = possibilities + 1;
        }
    }

    console.log('num possibilities', possibilities);
};

// Needs one of exactly two numbers
const hasDoubleDigits = (num) => {
    const numString = String(num);
    let lastNum = null;
    for (let i = 0; i < numString.length; i++) {
        const thisNum = numString[i];
        if (lastNum !== null && lastNum === thisNum) {
            // make sure its not the third in a sequence
            if (i > 1 && i < numString.length - 1) {
                if (numString[i - 2] !== thisNum && numString[i + 1] !== thisNum) {
                    return true;
                }
            } else if (i > 1) {
                if (numString[i - 2] !== thisNum) {
                    return true;
                }
            } else if (i < numString.length - 1) {
                if (numString[i + 1] !== thisNum) {
                    return true;
                }
            } else {
                throw Error('this shouldnt happen ' + i);
            }
        }
        lastNum = numString[i];
    }

    return false;
};

const hasDecreasingDigits = (num) => {
    const numString = String(num);
    let lastNum = null;
    for (let i = 0; i < numString.length; i++) {
        if (lastNum !== null) {
            const thisNum = Number(numString[i]);

            if (thisNum < lastNum) {
                return false;
            }
            lastNum = thisNum;
        } else {
            lastNum = Number(numString[i]);
        }
    }

    return true;
};

main();