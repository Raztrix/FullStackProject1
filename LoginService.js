let userName = document.getElementById("user-name");
let password = document.getElementById("password");
let loginButton = document.getElementById("login-button");
let form = document.getElementById("form");
let errorDiv = document.getElementById("error-div");
let errorElement_h4 = document.createElement("h4");

form.addEventListener("submit", async function (e) {
  await fetch("https://localhost:7001/api/Auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      userName: userName.value,
      password: password.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success == true) {
        window.localStorage.clear(); //clears ls if there is any previous token
        window.localStorage.setItem("token", data.data); // set the current token
        window.location = "http://127.0.0.1:5500/index.html";
      } else {
        errorDiv.className = "row bg-danger text-center text-white";
        errorDiv.appendChild(errorElement_h4);
        errorElement_h4.innerText = `${data.message}`;
        setTimeout(() => {
          errorDiv.remove();
          window.location.reload();
        }, 2000);
      }
    })
    .catch((error) => console.log(error));
  e.preventDefault();
});
