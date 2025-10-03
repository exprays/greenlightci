// Test JavaScript file with various Baseline features

// Optional Chaining - Widely Available in Baseline 2023
const user = {
  profile: {
    name: 'John'
  }
};
console.log(user?.profile?.name);
console.log(user?.settings?.theme);

// Nullish Coalescing - Widely Available
const theme = user?.settings?.theme ?? 'light';
const count = 0 ?? 10; // 0 is not nullish

// Dynamic Import - Widely Available
async function loadModule() {
  const module = await import('./utils.js');
  module.doSomething();
}

// Top-level Await - Newly Available
const data = await fetch('/api/data');
const json = await data.json();

// Private Fields - Newly Available
class Counter {
  #count = 0;
  
  increment() {
    this.#count++;
  }
  
  getCount() {
    return this.#count;
  }
}

// Array methods - checking newer features
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((a, b) => a + b, 0);

// Object destructuring - Widely Available
const { profile: { name } } = user;

// Spread operator - Widely Available
const newUser = { ...user, id: 123 };
const newNumbers = [...numbers, 6, 7];

// Template literals - Widely Available
const greeting = `Hello, ${name}!`;

// Arrow functions - Widely Available
const add = (a, b) => a + b;
const square = x => x * x;

// Promises - Widely Available
fetch('/api/users')
  .then(response => response.json())
  .then(users => console.log(users))
  .catch(error => console.error(error));

// Async/Await - Widely Available
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    return users;
  } catch (error) {
    console.error(error);
  }
}
