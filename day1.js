const fs = require('fs');

const main = async () => {
  const items = fs.readFileSync('day1input.txt').toString().split('\n');
  let total = 0; 
  let fuel = 0;
  for (const item of items) {
    fuel = neededFuel(Number(item));
    while (fuel > 0) {
      total = total + fuel
      fuel = neededFuel(fuel)
    }
  }

  console.log(total)
}

const neededFuel = (mass) => {
  return Math.floor(mass/3) - 2;
}

main()
