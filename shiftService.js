let tbodyShift = document.getElementById("t-body-shift");
let saveAddShiftChange = document.getElementById("save-add-shift");
let addDate = document.getElementById("add-date");
let addShiftId = document.getElementById("add-shift-id");
let startTime = document.getElementById("add-start");
let endTime = document.getElementById("add-end");

// here we get shifts info
fetch("https://localhost:7001/api/Shift/")
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      tbodyShift.appendChild(document.createElement("tr"));
      tbodyShift
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("shiftId");
      tbodyShift
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("date");
      tbodyShift
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("startTime");
      tbodyShift
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("endTime");
      tbodyShift
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("empRegistered");

      tbodyShift
        .getElementsByTagName("tr")
        [i].getElementsByClassName("shiftId")[0].innerText = data[i].shiftId;
      tbodyShift
        .getElementsByTagName("tr")
        [i].getElementsByClassName("date")[0].innerText = data[i].date;
      tbodyShift
        .getElementsByTagName("tr")
        [i].getElementsByClassName("startTime")[0].innerText =
        data[i].startTime;
      tbodyShift
        .getElementsByTagName("tr")
        [i].getElementsByClassName("endTime")[0].innerText = data[i].endTime;
      getEmpReg(data[i].shiftId, i);
    }
  })
  .catch((err) => console.log(err));

function getEmpReg(shiftId, i) {
  fetch(`https://localhost:7001/api/Shift/empReg/${shiftId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "applicaton/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      shiftId: shiftId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      tbodyShift
        .getElementsByTagName("tr")
        [i].getElementsByClassName("empRegistered")[0]
        .appendChild(document.createElement("ul"));
      for (let j = 0; j < data.length; j++) {
        tbodyShift
          .getElementsByTagName("tr")
          [i].getElementsByClassName("empRegistered")[0]
          .firstElementChild.appendChild(document.createElement("li"));
        tbodyShift
          .getElementsByTagName("tr")
          [i].getElementsByClassName(
            "empRegistered"
          )[0].firstElementChild.lastElementChild.innerHTML = `<a  href="http://127.0.0.1:5500/employees.html">${data[j].firstName}</a>`;
      }
    })
    .catch((err) => console.log(err));
}

/// add shift event
saveAddShiftChange.addEventListener("click", function () {
  fetch("https://localhost:7001/api/Shift/addShift", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "applicaton/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      date: addDate.value,
      startTime: startTime.value,
      endTime: endTime.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data != "Shift Already Exist") {
        location.reload();
      }
    })
    .catch((err) => console.log(err));
});

// update the num of actions

saveAddShiftChange.addEventListener("mouseup", function () {
  fetch(`https://localhost:7001/api/Auth/numOfActions/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "applicaton/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data != "Shift Already Exist") {
        location.reload();
      }
    })
    .catch((err) => console.log(err));
});
