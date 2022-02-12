let editEmpFname = document.getElementById("edit-emp-fname");
let editEmpLname = document.getElementById("edit-emp-lname");
let EmpID = document.getElementById("edit-emp-id");
let editEmpSwy = document.getElementById("edit-emp-swy");
let tbody = document.getElementById("t-body-employees");
let saveEmpChanges = document.getElementById("save-emp-changes");
let selectDepName = document.getElementById("select-dep-name");
let xModalBtn = document.getElementById("x");
let addEmpShift_empID = document.getElementById("add-emp2-id");
let addEmpShift_ShiftId = document.getElementById("add-empshift-id");
let saveEmpShiftChanges = document.getElementById("save-empShift-changes");
let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");
let tbodySearch = document.getElementById("search-tbody");

// here we gets the employees info.
fetch("https://localhost:7001/api/Employee/employeesInfo")
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      tbody.appendChild(document.createElement("tr"));
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("empID");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("fname");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("lname");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("SWY");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("depID");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("employeesShifts");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("Delete/Edit/Add");

      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("empID")[0].innerText = data[i].employeeID;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("fname")[0].innerText = data[i].firstName;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("lname")[0].innerText = data[i].lastName;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("SWY")[0].innerText = data[i].startWorkYear;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("depID")[0].innerText = data[i].departmentID;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("employeesShifts")[0].innerHTML = `<ul>
          <li></li>
          <li></li>
      </ul>`;
      // functions to get the employees shifts by id and row number.
      getTheShiftsDateById(data[i].employeeID, i);
      getShiftsTimeById(data[i].employeeID, i);
      //<----------->//
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName(
          "Delete/Edit/Add"
        )[0].innerHTML = `<a type="button" class="btn btn-info" href="#" data-toggle="modal" data-target="#editEmpModal">Edit</a>
      <button type="submit" class="btn btn-danger">Delete</button>
      <button type="submit" class="btn btn-success" data-toggle="modal" data-target="#addEmpShiftModal">Add Shift</button>`;
    }
    setDelEvents();
    setEditButtonEvents(data);
    setAddEmployeeShiftEvents();
  });

// function that give you the shifts for every employee by id and row number
function getTheShiftsDateById(id, i) {
  fetch(`https://localhost:7001/api/Employee/${id}`, {
    method: "POST",
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
    .then((response) => response.json())
    .then((shiftsDate) => {
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName(
          "employeesShifts"
        )[0].firstElementChild.firstElementChild.innerHTML = `${shiftsDate}`;
    })
    .catch((err) => console.log(err));
}

function getShiftsTimeById(id, i) {
  fetch(`https://localhost:7001/api/Employee/shiftTime/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((time) => {
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName(
          "employeesShifts"
        )[0].firstElementChild.lastElementChild.innerHTML = `${time}`;
    })
    .catch((err) => console.log(err));
}
// event listener for saving the edit data
saveEmpChanges.addEventListener("click", function (e) {
  fetch("https://localhost:7001/api/Employee/editEmployee", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      employeeID: EmpID.value,
      firstName: editEmpFname.value,
      lastName: editEmpLname.value,
      startWorkYear: editEmpSwy.value,
      departmentID: selectDepName.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data != "Employee already exist") {
        location.reload();
      }
    })
    .catch((err) => console.log(err));
  e.preventDefault();
});

// get the depratment id by department name for the edit department //
function getDepratmentIdByName(name) {
  return fetch(`https://localhost:7001/api/Department/${name}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      request: name,
    }),
  })
    .then((res) => res.json())
    .then((id) => id)
    .catch((err) => console.log(err));
}

// function to set edit events

function setEditButtonEvents(data) {
  for (let i = 0; i < data.length; i++) {
    tbody
      .getElementsByTagName("tr")
      [i].getElementsByClassName("btn-info")[0]
      .addEventListener("click", function () {
        fetch("https://localhost:7001/api/Department/departmentsNames")
          .then((res) => res.json())
          .then((depArr) => {
            depArr.forEach((department) => {
              selectDepName.appendChild(document.createElement("option"));
              selectDepName.lastElementChild.innerHTML = `${department.name}`;
              selectDepName.lastElementChild.value = `${department.id}`;
            });
          })
          .catch((err) => console.log(err));
      });
    /// if i press the x button in the modal it erease the dep => prevent from departments duplicates //////
    xModalBtn.addEventListener("click", function () {
      var optionsArr = selectDepName.getElementsByTagName("option");
      for (let i = 0; i < optionsArr.length; i++) {
        optionsArr[i].remove();
      }
    });
  }
}

function onchangeFriend() {
  console.log(document.getElementById("select-dep-name").value);
  return document.getElementById("select-dep-name").value;
}

// addEmployeeshiftEvents => put that function after the buttons created
function setAddEmployeeShiftEvents() {
  saveEmpShiftChanges.addEventListener("click", function () {
    fetch("https://localhost:7001/api/Employee/addEmployeeShift", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT,DELETE",
      },
      body: JSON.stringify({
        employee_id: addEmpShift_empID.value,
        shift_id: addEmpShift_ShiftId.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        location.reload();
      })
      .catch((err) => console.log(err));
  });
}

// delete Department => put that function after the buttons created
function setDelEvents() {
  Array.prototype.slice
    .call(document.getElementsByClassName("btn-danger"))
    .forEach((btn, index) => {
      btn.addEventListener("mouseup", function () {
        console.log(
          tbody
            .getElementsByTagName("tr")
            [index].getElementsByClassName("empID")[0].innerText
        );
        let theId = tbody
          .getElementsByTagName("tr")
          [index].getElementsByClassName("empID")[0].innerText;
        fetch(
          `https://localhost:7001/api/Employee/${
            tbody
              .getElementsByTagName("tr")
              [index].getElementsByClassName("empID")[0].innerText
          }`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Methods":
                "GET,HEAD,OPTIONS,POST,PUT,DELETE",
            },
            body: JSON.stringify({
              id: theId,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data != "Employee Not Found") {
              location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
}

searchButton.addEventListener("click", function () {
  fetch(
    `https://localhost:7001/api/Employee/EmployeeSearch/${searchInput.value}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT,DELETE",
      },
      body: JSON.stringify({
        name: searchInput.value,
      }),
    }
  )
    .then((res) => {
      if (res.ok == false) {
        document.getElementById(
          "for-error"
        ).innerHTML = `<h4 class="text-center text-danger">Not Found!</h4>`;
        setTimeout(function () {
          document.getElementById("for-error").innerHTML = "";
        }, 3000);
        return "Employee does not exist";
      }
      return res.json();
    })
    .then((results) => {
      for (let i = 0; i < results.length; i++) {
        tbodySearch.appendChild(document.createElement("tr"));
        tbodySearch
          .getElementsByTagName("tr")
          [i].appendChild(document.createElement("td"))
          .classList.add("empID");
        tbodySearch
          .getElementsByTagName("tr")
          [i].appendChild(document.createElement("td"))
          .classList.add("fname");
        tbodySearch
          .getElementsByTagName("tr")
          [i].appendChild(document.createElement("td"))
          .classList.add("lname");
        tbodySearch
          .getElementsByTagName("tr")
          [i].appendChild(document.createElement("td"))
          .classList.add("SWY");
        tbodySearch
          .getElementsByTagName("tr")
          [i].appendChild(document.createElement("td"))
          .classList.add("depID");
        tbodySearch
          .getElementsByTagName("tr")
          [i].appendChild(document.createElement("td"))
          .classList.add("employeesShifts");

        tbodySearch
          .getElementsByTagName("tr")
          [i].getElementsByClassName("empID")[0].innerText =
          results[i].employeeID;
        tbodySearch
          .getElementsByTagName("tr")
          [i].getElementsByClassName("fname")[0].innerText =
          results[i].firstName;
        tbodySearch
          .getElementsByTagName("tr")
          [i].getElementsByClassName("lname")[0].innerText =
          results[i].lastName;
        tbodySearch
          .getElementsByTagName("tr")
          [i].getElementsByClassName("SWY")[0].innerText =
          results[i].startWorkYear;
        tbodySearch
          .getElementsByTagName("tr")
          [i].getElementsByClassName("depID")[0].innerText =
          results[i].departmentID;
        tbodySearch
          .getElementsByTagName("tr")
          [i].getElementsByClassName("employeesShifts")[0].innerHTML = `<ul>
            <li></li>
            <li></li>
        </ul>`;
        // functions to get the employees shifts by id and row number.
        getTheShiftsDateByIdSearch(results[i].employeeID, i);
        getShiftsTimeByIdSearch(results[i].employeeID, i);
        //<----------->//
      }
    })
    .catch((err) => console.log(err));
});

function getShiftsTimeByIdSearch(id, i) {
  fetch(`https://localhost:7001/api/Employee/${id}`, {
    method: "POST",
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
    .then((response) => response.json())
    .then((shiftsDate) => {
      tbodySearch
        .getElementsByTagName("tr")
        [i].getElementsByClassName(
          "employeesShifts"
        )[0].firstElementChild.firstElementChild.innerHTML = `${shiftsDate}`;
    })
    .catch((err) => console.log(err));
}

function getTheShiftsDateByIdSearch(id, i) {
  fetch(`https://localhost:7001/api/Employee/shiftTime/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((time) => {
      tbodySearch
        .getElementsByTagName("tr")
        [i].getElementsByClassName(
          "employeesShifts"
        )[0].firstElementChild.lastElementChild.innerHTML = `${time}`;
    })
    .catch((err) => console.log(err));
}
