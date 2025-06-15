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
  if (!name || !dept) return;

  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.unshift({ name, dept }); // add to beginning
  employees = employees.slice(0, 10); // keep only latest 10
  localStorage.setItem("employees", JSON.stringify(employees));
  loadEmployees();

  // Clear form
  document.getElementById("empName").value = "";
  document.getElementById("empDept").value = "";
}

function loadEmployees() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const tbody = document.getElementById("empTableBody");
  tbody.innerHTML = "";
  employees.forEach(emp => {
    const row = `<tr><td>${emp.name}</td><td>${emp.dept}</td></tr>`;
    tbody.innerHTML += row;
  });
}
