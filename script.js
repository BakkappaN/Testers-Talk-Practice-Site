const DUMMY_USER = "TestersTalk";
const DUMMY_PASS = "TestersTalk";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === DUMMY_USER && pass === DUMMY_PASS) {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("appDiv").style.display = "block";
    loadEmployees();
  } else {
    document.getElementById("loginError").innerText = "Invalid login!";
  }
}

function saveEmployee() {
  const name = document.getElementById("empName").value;
  const dept = document.getElementById("empDept").value;
  const dob = document.getElementById("empDob").value;
  const gender = document.getElementById("empGender").value;

  const techCheckboxes = document.querySelectorAll(".techCheck");
  const technologies = Array.from(techCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const country = document.querySelector("input[name='country']:checked").value;

  if (!name || !dept || !dob) return;

  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.unshift({ name, dept, dob, gender, technologies, country });
  employees = employees.slice(0, 10);
  localStorage.setItem("employees", JSON.stringify(employees));
  loadEmployees();

  document.getElementById("empName").value = "";
  document.getElementById("empDept").value = "";
  document.getElementById("empDob").value = "";
  document.getElementById("empGender").value = "Male";
  techCheckboxes.forEach(cb => cb.checked = false);
  document.querySelector("input[name='country'][value='India']").checked = true;
}

function loadEmployees() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const tbody = document.getElementById("empTableBody");
  tbody.innerHTML = "";
  employees.forEach(emp => {
    const row = `<tr>
      <td>${emp.name}</td>
      <td>${emp.dept}</td>
      <td>${emp.dob}</td>
      <td>${emp.gender}</td>
      <td>${emp.technologies.join(", ")}</td>
      <td>${emp.country}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileName = document.getElementById("fileName");
  const downloadLink = document.getElementById("downloadLink");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      fileName.textContent = "Selected: " + file.name;
      const fileURL = URL.createObjectURL(file);
      downloadLink.href = fileURL;
      downloadLink.download = file.name;
      downloadLink.style.display = "inline-block";
    } else {
      fileName.textContent = "No file selected";
      downloadLink.style.display = "none";
    }
  });
});