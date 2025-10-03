// Optional Chaining Example
const user = {
  profile: {
    name: 'John',
    address: {
      city: 'New York'
    }
  }
};

const city = user?.profile?.address?.city;
const phone = user?.profile?.contact?.phone; // undefined without error

// Nullish Coalescing Example
const defaultValue = 'default';
const value1 = null ?? defaultValue; // 'default'
const value2 = undefined ?? defaultValue; // 'default'
const value3 = 0 ?? defaultValue; // 0 (not replaced)
const value4 = '' ?? defaultValue; // '' (not replaced)

// Dynamic Import Example
async function loadModule() {
  const module = await import('./utils.js');
  return module.default;
}

// Conditional dynamic import
if (condition) {
  const heavyModule = await import('./heavy-module.js');
  heavyModule.init();
}

// Top-level Await Example
const config = await fetch('/api/config').then(r => r.json());
const data = await import('./data.json');

console.log('Config loaded:', config);

// Private Fields Example
class UserAccount {
  #balance = 0;
  #accountNumber;
  
  constructor(accountNumber) {
    this.#accountNumber = accountNumber;
  }
  
  deposit(amount) {
    this.#balance += amount;
    return this.#getBalance();
  }
  
  #getBalance() {
    return this.#balance;
  }
  
  getPublicInfo() {
    return {
      accountNumber: this.#accountNumber,
      balance: this.#balance
    };
  }
}

// Combined Modern Features
class ModernComponent {
  #state = null;
  #subscribers = [];
  
  constructor(initialState) {
    this.#state = initialState ?? {};
  }
  
  async loadData() {
    const module = await import('./data-loader.js');
    const data = await module.fetchData();
    
    this.#state = data?.results?.[0] ?? this.#state;
    this.#notifySubscribers();
  }
  
  #notifySubscribers() {
    this.#subscribers.forEach(callback => callback?.(this.#state));
  }
  
  subscribe(callback) {
    if (callback) {
      this.#subscribers.push(callback);
    }
  }
}

// Real-world usage
const component = new ModernComponent({ count: 0 });
component.subscribe((state) => {
  console.log('State updated:', state?.count ?? 0);
});

await component.loadData();
