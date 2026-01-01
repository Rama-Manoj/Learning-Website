// Helper: query selector
function $(selector, scope) {
  return (scope || document).querySelector(selector);
}
function $all(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

// Theme toggle with persistence
(function setupTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  updateToggleEmoji();
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleEmoji();
    });
  }

  function updateToggleEmoji() {
    if (!toggle) return;
    const isDark = (document.documentElement.getAttribute('data-theme') || 'light') === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-pressed', String(isDark));
  }
})();

// Mobile nav toggle
(function setupMobileNav() {
  const btn = document.querySelector('.nav-toggle');
  const list = document.getElementById('primary-nav');
  if (!btn || !list) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    list.classList.toggle('open');
  });
})();

// Current year in footer
(function footerYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
})();

// Collapsible topic sections
(function collapsibles() {
  $all('.collapse-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const controlsId = btn.getAttribute('aria-controls');
      const content = controlsId ? document.getElementById(controlsId) : null;
      if (content) {
        const isHidden = content.hasAttribute('hidden');
        if (isHidden) content.removeAttribute('hidden');
        else content.setAttribute('hidden', '');
      }
    });
  });
})();

// Example: Toggle code vs preview
(function exampleToggles() {
  function toggleTarget(targetSelector) {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const hidden = el.getAttribute('aria-hidden') === 'true';
    el.setAttribute('aria-hidden', String(!hidden));
  }

  // Initialize: Show code by default, hide preview
  function initializeExampleToggles() {
    $all('.code').forEach((el) => {
      el.setAttribute('aria-hidden', 'false');
    });
    $all('.preview').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
    });
    $all('.explanation').forEach((el) => {
      el.setAttribute('aria-hidden', 'false');
    });
  }

  $all('.toggle-code').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleTarget(btn.dataset.target);
      // Hide other elements in the same example
      const example = btn.closest('.example');
      if (example) {
        $all('.preview', example).forEach((el) => el.setAttribute('aria-hidden', 'true'));
        $all('.explanation', example).forEach((el) => el.setAttribute('aria-hidden', 'true'));
      }
    });
  });
  
  $all('.toggle-preview').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleTarget(btn.dataset.target);
      // Hide other elements in the same example
      const example = btn.closest('.example');
      if (example) {
        $all('.code', example).forEach((el) => el.setAttribute('aria-hidden', 'true'));
        $all('.explanation', example).forEach((el) => el.setAttribute('aria-hidden', 'true'));
      }
    });
  });
  
  $all('.toggle-expl').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleTarget(btn.dataset.target);
      // Hide other elements in the same example
      const example = btn.closest('.example');
      if (example) {
        $all('.code', example).forEach((el) => el.setAttribute('aria-hidden', 'true'));
        $all('.preview', example).forEach((el) => el.setAttribute('aria-hidden', 'true'));
      }
    });
  });

  // Initialize on page load
  initializeExampleToggles();
})();

// Initialize variables demo on page load
(function initializeVariables() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVariablesDemo);
  } else {
    initializeVariablesDemo();
  }
})();

// Initialize events demo on page load
(function initializeEvents() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEventsDemo);
  } else {
    initializeEventsDemo();
  }
})();

// Basic nav highlight based on current URL
(function highlightNav() {
  const path = location.pathname.split('/').pop();
  $all('.nav-link').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href === path) a.classList.add('active');
  });
})();

// TOC scrollspy and Prev/Next topic links
(function tocAndPagination() {
  const tocLinks = $all('#tocNav a');
  if (!tocLinks.length) return;
  const sections = tocLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  // Scrollspy using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) {
        tocLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        updatePrevNext(`#${id}`);
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  sections.forEach((sec) => observer.observe(sec));

  function updatePrevNext(currentHash) {
    const index = tocLinks.findIndex((l) => l.getAttribute('href') === currentHash);
    const prev = document.getElementById('prevTopic');
    const next = document.getElementById('nextTopic');
    if (!prev || !next) return;
    if (index > 0) {
      prev.href = tocLinks[index - 1].getAttribute('href');
      prev.textContent = `← ${tocLinks[index - 1].textContent}`;
      prev.removeAttribute('aria-disabled');
    } else {
      prev.href = '#';
      prev.textContent = '← Previous';
      prev.setAttribute('aria-disabled', 'true');
    }
    if (index < tocLinks.length - 1 && index !== -1) {
      next.href = tocLinks[index + 1].getAttribute('href');
      next.textContent = `${tocLinks[index + 1].textContent} →`;
      next.removeAttribute('aria-disabled');
    } else {
      next.href = '#';
      next.textContent = 'Next →';
      next.setAttribute('aria-disabled', 'true');
    }
  }
})();

// Basic contact form validation
(function contactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const status = document.getElementById('formStatus');

  function showError(input, msg) {
    const container = input.closest('.form-field');
    const small = container ? container.querySelector('.error') : null;
    if (small) small.textContent = msg || '';
  }

  function clearErrors() {
    $all('.form-field .error', form).forEach((s) => (s.textContent = ''));
    status.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      valid = false;
    }
    const emailVal = email.value.trim();
    if (!emailVal) {
      showError(email, 'Please enter your email');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showError(email, 'Please enter a valid email');
      valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, 'Message should be at least 10 characters');
      valid = false;
    }

    if (!valid) {
      status.textContent = 'Please fix the errors above.';
      return;
    }

    status.textContent = 'Thanks! Your message has been validated locally.';
    form.reset();
  });
})();

// JavaScript demo functions for loops section
const fruits = ['apple', 'banana', 'orange'];

function demoForLoop() {
  const output = document.getElementById('loop-output');
  let html = '<p><strong>For Loop:</strong></p><ul>';
  
  for (let i = 0; i < fruits.length; i++) {
    html += `<li>Index ${i}: ${fruits[i]}</li>`;
  }
  
  html += '</ul>';
  output.innerHTML = html;
}

function demoWhileLoop() {
  const output = document.getElementById('loop-output');
  let html = '<p><strong>While Loop:</strong></p><ul>';
  let count = 0;
  
  while (count < 3) {
    html += `<li>Count: ${count}</li>`;
    count++;
  }
  
  html += '</ul>';
  output.innerHTML = html;
}

function demoForOfLoop() {
  const output = document.getElementById('loop-output');
  let html = '<p><strong>For...of Loop:</strong></p><ul>';
  
  for (const fruit of fruits) {
    html += `<li>${fruit}</li>`;
  }
  
  html += '</ul>';
  output.innerHTML = html;
}

function demoLoopControl() {
  const output = document.getElementById('loop-output');
  let html = '<p><strong>Loop Control (break at 5):</strong></p><ul>';
  
  for (let i = 0; i < 10; i++) {
    if (i === 5) {
      html += `<li>Breaking at ${i}</li>`;
      break;
    }
    html += `<li>Count: ${i}</li>`;
  }
  
  html += '</ul>';
  output.innerHTML = html;
}

// JavaScript demo functions for conditions section
function demoIfElse() {
  const output = document.getElementById('condition-output');
  const age = 25;
  let message;
  
  if (age >= 18) {
    message = 'You are an adult';
  } else {
    message = 'You are a minor';
  }
  
  output.innerHTML = `<p><strong>Age ${age}:</strong> ${message}</p>`;
}

function demoSwitch() {
  const output = document.getElementById('condition-output');
  const day = 'Friday';
  let message;
  
  switch (day) {
    case 'Monday':
      message = 'Start of work week';
      break;
    case 'Friday':
      message = 'TGIF!';
      break;
    case 'Saturday':
    case 'Sunday':
      message = 'Weekend!';
      break;
    default:
      message = 'Regular day';
  }
  
  output.innerHTML = `<p><strong>${day}:</strong> ${message}</p>`;
}

function demoTernary() {
  const output = document.getElementById('condition-output');
  const isStudent = true;
  const age = 20;
  
  const status = age >= 18 ? 'adult' : 'minor';
  const greeting = isStudent ? 'Welcome student!' : 'Welcome!';
  
  output.innerHTML = `
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Greeting:</strong> ${greeting}</p>
  `;
}

function demoLogical() {
  const output = document.getElementById('condition-output');
  const isStudent = true;
  const hasDiscount = false;
  const age = 16;
  
  let message = '';
  if (isStudent || hasDiscount) {
    message += 'You get a discount! ';
  }
  if (isStudent && age >= 16) {
    message += 'You can attend school.';
  }
  
  output.innerHTML = `<p><strong>Result:</strong> ${message}</p>`;
}

// JavaScript demo functions for objects section
const person = {
  name: 'Alice',
  age: 30,
  city: 'New York',
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

function demoObjectAccess() {
  const output = document.getElementById('object-output');
  output.innerHTML = `
    <p><strong>Object Properties:</strong></p>
    <p>Name: ${person.name}</p>
    <p>Age: ${person.age}</p>
    <p>City: ${person.city}</p>
    <p>Keys: [${Object.keys(person).join(', ')}]</p>
  `;
}

function demoObjectMethods() {
  const output = document.getElementById('object-output');
  output.innerHTML = `
    <p><strong>Object Methods:</strong></p>
    <p>${person.greet()}</p>
  `;
}

function demoObjectDestructuring() {
  const output = document.getElementById('object-output');
  const { name, age, city } = person;
  output.innerHTML = `
    <p><strong>Destructuring:</strong></p>
    <p>Name: ${name}</p>
    <p>Age: ${age}</p>
    <p>City: ${city}</p>
  `;
}

function demoObjectSpread() {
  const output = document.getElementById('object-output');
  const updatedPerson = { ...person, age: 31, email: 'alice@example.com' };
  output.innerHTML = `
    <p><strong>Spread Operator:</strong></p>
    <p>Updated age: ${updatedPerson.age}</p>
    <p>New email: ${updatedPerson.email}</p>
  `;
}

// JavaScript demo functions for variables section
let counter = 0;

function incrementCounter() {
  counter++;
  document.getElementById('counter').textContent = counter;
}

// Initialize variables demo on page load
function initializeVariablesDemo() {
  const greeting = 'Hello';
  let name = 'Ada';
  const message = `${greeting}, ${name}!`;
  
  const age = 25;
  const isStudent = true;
  const hobbies = ['reading', 'coding'];
  const person = { name: 'Alice', age: 30 };
  
  // Display outputs
  const greetingOutput = document.getElementById('greeting-output');
  const dataTypesOutput = document.getElementById('data-types-output');
  const templateOutput = document.getElementById('template-output');
  
  if (greetingOutput) greetingOutput.textContent = message;
  if (dataTypesOutput) dataTypesOutput.textContent = 
    `Age: ${age}, Student: ${isStudent}, Hobbies: ${hobbies.join(', ')}`;
  if (templateOutput) templateOutput.textContent = 
    `Person: ${person.name}, Age: ${person.age}`;
}

// JavaScript demo functions for functions section
function greet(name) {
  return `Hello, ${name}!`;
}

const add = function(a, b) {
  return a + b;
};

const multiply = (a, b) => a * b;

function createUser(name, age = 18, isActive = true) {
  return {
    name,
    age,
    isActive,
    greet: () => `Hi, I'm ${name}`
  };
}

function processNumbers(numbers, operation) {
  return numbers.map(operation);
}

function demoGreet() {
  const output = document.getElementById('function-output');
  output.innerHTML = `<p>${greet('Alice')}</p>`;
}

function demoMath() {
  const output = document.getElementById('function-output');
  output.innerHTML = `
    <p>Add: ${add(5, 3)}</p>
    <p>Multiply: ${multiply(4, 6)}</p>
  `;
}

function demoUser() {
  const output = document.getElementById('function-output');
  const user = createUser('Bob', 25);
  output.innerHTML = `
    <p>User: ${user.name}, Age: ${user.age}</p>
    <p>${user.greet()}</p>
  `;
}

function demoArray() {
  const output = document.getElementById('function-output');
  const numbers = [1, 2, 3, 4, 5];
  const doubled = processNumbers(numbers, x => x * 2);
  output.innerHTML = `
    <p>Original: [${numbers.join(', ')}]</p>
    <p>Doubled: [${doubled.join(', ')}]</p>
  `;
}

// JavaScript demo functions for DOM section
function changeContent() {
  const element = document.getElementById('demo-element');
  element.textContent = 'Content changed!';
  element.innerHTML = '<em>Content changed with HTML!</em>';
}

function changeStyle() {
  const element = document.getElementById('demo-element');
  element.style.backgroundColor = '#e0f0ff';
  element.style.color = '#0066cc';
  element.style.borderRadius = '5px';
}

function addClass() {
  const element = document.getElementById('demo-element');
  element.classList.add('highlight');
  element.style.background = '#fff3cd';
  element.style.border = '2px solid #ffc107';
}

function createElement() {
  const container = document.getElementById('new-elements');
  const newElement = document.createElement('div');
  newElement.textContent = 'New element created!';
  newElement.style.padding = '5px';
  newElement.style.margin = '5px 0';
  newElement.style.background = '#d4edda';
  newElement.style.border = '1px solid #c3e6cb';
  container.appendChild(newElement);
}

// JavaScript demo functions for events section
function logEvent(message) {
  const log = document.getElementById('event-log');
  const time = new Date().toLocaleTimeString();
  log.innerHTML += `<div>[${time}] ${message}</div>`;
  log.scrollTop = log.scrollHeight;
}

// Initialize events demo
function initializeEventsDemo() {
  // Click event
  const clickDemo = document.getElementById('click-demo');
  if (clickDemo) {
    clickDemo.addEventListener('click', function() {
      logEvent('Button clicked!');
      this.style.backgroundColor = this.style.backgroundColor === 'lightgreen' ? '' : 'lightgreen';
    });
  }
  
  // Hover events
  const hoverDemo = document.getElementById('hover-demo');
  if (hoverDemo) {
    hoverDemo.addEventListener('mouseover', function() {
      this.style.backgroundColor = 'lightblue';
      logEvent('Mouse over element');
    });
    
    hoverDemo.addEventListener('mouseout', function() {
      this.style.backgroundColor = '';
      logEvent('Mouse left element');
    });
  }
  
  // Input events
  const inputDemo = document.getElementById('input-demo');
  if (inputDemo) {
    inputDemo.addEventListener('input', function() {
      logEvent(`Input changed: "${this.value}"`);
    });
    
    inputDemo.addEventListener('focus', function() {
      this.style.borderColor = 'blue';
      logEvent('Input focused');
    });
    
    inputDemo.addEventListener('blur', function() {
      this.style.borderColor = 'gray';
      logEvent('Input blurred');
    });
  }
  
  // Keyboard events
  document.addEventListener('keydown', function(event) {
    logEvent(`Key pressed: ${event.key}`);
  });
  
  // Window events
  window.addEventListener('resize', function() {
    logEvent('Window resized');
  });
}

// JavaScript demo functions for arrays section
const arrayFruits = ['apple', 'banana', 'orange', 'grape'];
const arrayNumbers = [1, 2, 3, 4, 5];

function demoArrayMethods() {
  const output = document.getElementById('array-output');
  const upperFruits = arrayFruits.map(fruit => fruit.toUpperCase());
  const longFruits = arrayFruits.filter(fruit => fruit.length > 5);
  const sum = arrayNumbers.reduce((acc, num) => acc + num, 0);
  
  output.innerHTML = `
    <p><strong>Original:</strong> [${arrayFruits.join(', ')}]</p>
    <p><strong>Uppercase:</strong> [${upperFruits.join(', ')}]</p>
    <p><strong>Long fruits:</strong> [${longFruits.join(', ')}]</p>
    <p><strong>Sum of numbers:</strong> ${sum}</p>
  `;
}

function demoArrayIteration() {
  const output = document.getElementById('array-output');
  let html = '<p><strong>Iteration examples:</strong></p><ul>';
  
  arrayFruits.forEach(fruit => {
    html += `<li>${fruit}</li>`;
  });
  
  html += '</ul>';
  output.innerHTML = html;
}

function demoArrayDestructuring() {
  const output = document.getElementById('array-output');
  const [first, second, ...rest] = arrayFruits;
  
  output.innerHTML = `
    <p><strong>Destructuring:</strong></p>
    <p>First: ${first}</p>
    <p>Second: ${second}</p>
    <p>Rest: [${rest.join(', ')}]</p>
  `;
}

// JavaScript demo functions for async section
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demoDelay() {
  const output = document.getElementById('async-output');
  output.innerHTML = '<p>Starting delay...</p>';
  
  await delay(1000);
  output.innerHTML += '<p>1 second passed</p>';
  
  await delay(1000);
  output.innerHTML += '<p>2 seconds passed</p>';
}

async function demoFetch() {
  const output = document.getElementById('async-output');
  output.innerHTML = '<p>Fetching data...</p>';
  
  try {
    // Simulate API call
    await delay(500);
    const mockData = { name: 'John', age: 30 };
    output.innerHTML = `<p><strong>Data received:</strong> ${JSON.stringify(mockData)}</p>`;
  } catch (error) {
    output.innerHTML = `<p><strong>Error:</strong> ${error.message}</p>`;
  }
}

async function demoPromiseAll() {
  const output = document.getElementById('async-output');
  output.innerHTML = '<p>Fetching multiple data...</p>';
  
  try {
    const [data1, data2, data3] = await Promise.all([
      delay(300).then(() => ({ id: 1, name: 'Item 1' })),
      delay(200).then(() => ({ id: 2, name: 'Item 2' })),
      delay(400).then(() => ({ id: 3, name: 'Item 3' }))
    ]);
    
    output.innerHTML = `
      <p><strong>All data received:</strong></p>
      <ul>
        <li>${data1.name}</li>
        <li>${data2.name}</li>
        <li>${data3.name}</li>
      </ul>
    `;
  } catch (error) {
    output.innerHTML = `<p><strong>Error:</strong> ${error.message}</p>`;
  }
}

// JavaScript demo functions for error handling section
function demoBasicError() {
  const output = document.getElementById('error-output');
  try {
    const obj = null;
    obj.property; // This will throw an error
  } catch (error) {
    output.innerHTML = `<p><strong>Caught error:</strong> ${error.message}</p>`;
  }
}

function demoCustomError() {
  const output = document.getElementById('error-output');
  try {
    throw new Error('This is a custom error message');
  } catch (error) {
    output.innerHTML = `<p><strong>Custom error:</strong> ${error.message}</p>`;
  }
}

async function demoAsyncError() {
  const output = document.getElementById('error-output');
  output.innerHTML = '<p>Simulating async error...</p>';
  
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Async operation failed')), 500);
    });
  } catch (error) {
    output.innerHTML = `<p><strong>Async error:</strong> ${error.message}</p>`;
  }
}

function demoValidationError() {
  const output = document.getElementById('error-output');
  try {
    const user = { name: '', email: 'test@example.com' };
    if (!user.name) {
      throw new Error('Name is required');
    }
  } catch (error) {
    output.innerHTML = `<p><strong>Validation error:</strong> ${error.message}</p>`;
  }
}


