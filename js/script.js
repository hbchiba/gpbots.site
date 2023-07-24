function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('pass').value;

  var data = {
    email: email,
    password: password,
  };

  fetch(`${window.location.origin}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((window.location.href = 'https://gpbots.com'));
}

function showpass() {
  var x = document.getElementById('pass');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }
}

function loginNoSpace() {
  var ss = document.getElementById('email').value;
  ss = ss.replace(' ', '');
  ss = ss.replace('+', '');
  ss = ss.replace(' ', '');
  ss = ss.replace('+', '');
  document.getElementById('email').value = ss;
}

function emailNoSpace() {
  var ss = document.getElementById('email').value;
  ss = ss.replace(' ', '');
  ss = ss.replace('+', '');
  ss = ss.replace(' ', '');
  ss = ss.replace('+', '');
  document.getElementById('email').value = ss;
}

function passNoSpace() {
  var ss = document.getElementById('pass').value;
  ss = ss.replace(' ', '');
  ss = ss.replace('+', '');
  ss = ss.replace(' ', '');
  ss = ss.replace('+', '');
  document.getElementById('pass').value = ss;
}
