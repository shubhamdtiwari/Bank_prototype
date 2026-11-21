'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// all buttons
const loginBtn = document.querySelector('.login__btn');
const transferBtn = document.querySelector('.form__btn--transfer');
const LoanBtn = document.querySelector('.form__btn--loan');
const closeBtn = document.querySelector('.form__btn--close');
const sortBtn = document.querySelector('.btn--sort');

// selecting all displaying part
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// computing username

const createUsername = function (accs) {
  accs.forEach(function(acc){
    
    acc.username = acc.owner
    .toLowerCase()  
    .split(' ')
    .map(el=> el[0])
    .join('');
  })
}
createUsername(accounts);

// adding movements

const displayMovements = function (movements) {
  // for clearing the hardcode data
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
                <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
              <div class="movements__value">${mov}€</div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



// calculate balance

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance} €`;
};



// calculating display summarry
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${income}€`;

  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int, i) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// event handlers
let currentAccount;

loginBtn.addEventListener('click', function (e) {
  // prevent form to submit
  e.preventDefault();

  //giving currentAccount status to username enterd
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value,
  );

  // cheaking for correct pin

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display welcome msg
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    //clear inputs area
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    containerApp.style.opacity = 100;
    //display movemets
    displayMovements(currentAccount.movements);
    //display balance
    calcDisplayBalance(currentAccount.movements);
    //display summary
    calcDisplaySummary(currentAccount);
  }
});