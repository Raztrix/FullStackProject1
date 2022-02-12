let editDepName = document.getElementById("edit-dep-name");
let editManagerName = document.getElementById("edit-dep-manager");
let departmentID = document.getElementById("department-id");
let addDepName = document.getElementById("add-dep-name");
let addManagerName = document.getElementById("add-dep-manager");
let tbody = document.getElementById("t-body");
let saveDepChanges = document.getElementById("save-dep-changes");
let saveDepChanges2 = document.getElementById("save-dep-changes2");

// here we gets the departments info.
fetch("https://localhost:7001/api/Department/departmentsInfo")
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data.length; i++) {
      tbody.appendChild(document.createElement("tr"));
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("ID");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("Name");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("Manager");
      tbody
        .getElementsByTagName("tr")
        [i].appendChild(document.createElement("td"))
        .classList.add("Delete/Edit");

      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("ID")[0].innerText = data[i].id;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("Name")[0].innerText = data[i].name;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName("Manager")[0].innerText = data[i].manager;
      tbody
        .getElementsByTagName("tr")
        [i].getElementsByClassName(
          "Delete/Edit"
        )[0].innerHTML = `<a type="button" class="btn btn-info" href="#" data-toggle="modal" data-target="#editDepModal">Edit</a>
      <button type="submit" class="btn btn-danger">Delete</button>`;
    }
    setDelEvents();
  });

// here we can edit the department
saveDepChanges.addEventListener("click", function (e) {
  fetch("https://localhost:7001/api/Department/editDepartment", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      id: departmentID.value,
      name: editDepName.value,
      manager: editManagerName.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data != "Department already Exist") {
        location.reload();
      }
    })
    .catch((err) => console.log(err));

  e.preventDefault();
});

// delete Department => put that function after the buttons created
function setDelEvents() {
  Array.prototype.slice
    .call(document.getElementsByClassName("btn-danger"))
    .forEach((btn, index) => {
      btn.addEventListener("mouseup", function () {
        console.log(
          tbody
            .getElementsByTagName("tr")
            [index].getElementsByClassName("ID")[0].innerText
        );
        let theId = tbody
          .getElementsByTagName("tr")
          [index].getElementsByClassName("ID")[0].innerText;
        fetch(
          `https://localhost:7001/api/Department/${
            tbody
              .getElementsByTagName("tr")
              [index].getElementsByClassName("ID")[0].innerText
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
            if (data != "Department Not Found") {
              location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
            // adding the department remove error
            document
              .getElementById("div-for-err")
              .appendChild(document.createElement("h5")).innerText =
              "You can not remove a department when there are employees in it";
            // remove the masage after 3 seconds
            function removeDepWarning() {
              document.getElementById("div-for-err").remove();
              location.reload();
            }
            setTimeout(removeDepWarning, 2000);
          });
      });
    });
}

// add new department
saveDepChanges2.addEventListener("click", function (e) {
  fetch("https://localhost:7001/api/Department/addDepartment", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    },
    body: JSON.stringify({
      name: addDepName.value,
      manager: addManagerName.value,
      employeesList: null,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data != "Department already Exist") {
        location.reload();
      }
    })
    .catch((err) => console.log(err));

  e.preventDefault();
});
