'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2026-11-10T10:17:24.185Z',
    '2026-11-20T14:11:59.604Z',
    '2026-11-24T17:01:17.194Z',
    '2026-11-26T23:36:17.929Z',
    '2026-11-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Shubham Tiwari',
  movements: [20000, -20, 3400, -30, -2, 50, 4000, -4],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2026-11-20T14:11:59.604Z',
    '2026-11-24T17:01:17.194Z',
    '2026-11-26T23:36:17.929Z',
    '2026-11-27T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
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
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((el) => el[0])
      .join('');
  });
};
createUsername(accounts);

const formateMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
};

const formateCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// adding movements

const displayMovements = function (acc, sort = false) {
  // for clearing the hardcode data
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;const displayDate

  combinedMovsDates.forEach((obj, i) => {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formateMovementDate(
      date,
      currentAccount.locale || locale.navigator,
    );
    const formatedMov = formateCurr(movement, acc.locale, acc.currency);

    const html = `
                <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
              <div class="movements__value">${formatedMov}</div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// calculate balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = formateCurr(acc.balance, acc.locale, acc.currency);
};

// calculating display summarry
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = formateCurr(income, acc.locale, acc.currency);

  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = formateCurr(
    Math.abs(outcome),
    acc.locale,
    acc.currency,
  );

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int, i) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formateCurr(
    interest,
    acc.locale,
    acc.currency,
  );
};

const updateUI = function (acc) {
  //display movemets
  displayMovements(acc);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
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

  if (currentAccount?.pin === +inputLoginPin.value) {
    // display welcome msg
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    //clear inputs area
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    containerApp.style.opacity = 100;

    // update ui
    updateUI(currentAccount);

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale || locale,
      options,
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;
  }
});

// tranfer function
transferBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value,
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    // Adding tranfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);
  }
});
// loan function

LoanBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // Adding loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);

      // clear the input
      inputLoanAmount.value = '';
    }, 2500);
  }
});

// close function
closeBtn.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username,
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
sortBtn.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});