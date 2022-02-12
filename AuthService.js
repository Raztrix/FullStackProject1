let welcomeName = document.getElementById("welcome-name");
let localStorageToken = window.localStorage.getItem("token");
let logoutLink = document.getElementById("logout");

// logout remove the token.
logoutLink.addEventListener("click", function (e) {
  window.localStorage.clear();
  window.location = "http://127.0.0.1:5500/login.html";
});

// if token dosent exist.
if (localStorageToken == null) {
  window.location = "http://127.0.0.1:5500/login.html";
}
// send the token back to the server for authentication.
fetch("https://localhost:7001/api/Auth/identity", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
  },
  body: JSON.stringify({
    token: localStorageToken,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data != true) {
      window.location = "http://127.0.0.1:5500/login.html";
    }
  });

// get the full name for the navbar

fetch("https://localhost:7001/api/Auth/fullname", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
  },
  body: JSON.stringify({
    token: localStorageToken,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    welcomeName.innerText = data;
  });
