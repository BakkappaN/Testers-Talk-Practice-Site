const DUMMY_USER = "TestersTalk";
const DUMMY_PASS = "TestersTalk";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === DUMMY_USER && pass === DUMMY_PASS) {
    // Show loading overlay
    document.getElementById("loadingOverlay").style.display = "flex";
    
    // Wait for 1 second then proceed with login
    setTimeout(() => {
      document.getElementById("loadingOverlay").style.display = "none";
      document.getElementById("loginDiv").style.display = "none";
      document.getElementById("appDiv").style.display = "block";
      // Show welcome message
      const welcomeMsg = document.getElementById("welcomeMsg");
      if (welcomeMsg) {
        welcomeMsg.style.display = "block";
      }
      loadEmployees();
    }, 1000);
  } else {
    document.getElementById("loginError").innerText = "Invalid login! "+"try entering 'TestersTalk' as username and password.";
  }
}

function showCustomAlert(message) {
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    customAlert.style.display = 'flex';
}

function closeAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'none';
}

function saveEmployee() {
    // Get mandatory field values
    const name = document.getElementById('empName').value.trim();
    const department = document.getElementById('empDept').value.trim();
    const dob = document.getElementById('empDob').value;
    const gender = document.getElementById('empGender').value;
    
    // Check if mandatory fields are empty
    if (!name || !department || !dob || !gender) {
        showCustomAlert("Please fill in all mandatory fields marked with *");
        return false;
    }
    
    // Get selected technologies
    const technologies = [];
    document.querySelectorAll('.techCheck:checked').forEach(checkbox => {
        technologies.push(checkbox.value);
    });

    // Get selected country
    const country = document.querySelector('input[name="country"]:checked').value;

    // Create table row
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${name}</td>
        <td>${department}</td>
        <td>${dob}</td>
        <td>${gender}</td>
        <td>${technologies.join(', ')}</td>
        <td>${country}</td>
    `;

    // Add row to table
    const tbody = document.getElementById('empTableBody');
    tbody.insertBefore(tr, tbody.firstChild);

    // Keep only latest 10 records
    while (tbody.children.length > 10) {
        tbody.removeChild(tbody.lastChild);
    }

    // Clear form
    document.getElementById('empName').value = '';
    document.getElementById('empDept').value = '';
    document.getElementById('empDob').value = '';
    document.getElementById('empGender').value = 'Male';
    document.querySelectorAll('.techCheck:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelector('input[name="country"][value="India"]').checked = true;
    
    // Show success message
    showCustomAlert("Record saved successfully!");
    
    return true;
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
  // File upload handling
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

  // Tab switching logic
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      tabContents[idx].classList.add("active");
    });
  });

  // ✅ Drag and Drop functionality using jQuery UI
  if (typeof $ !== "undefined" && typeof $.ui !== "undefined") {
    $("#draggable").draggable();
    $("#droppable").droppable({
      drop: function (event, ui) {
        $(this)
          .addClass("ui-state-highlight")
          .html("Dropped!");
      }
    });
  } else {
    console.error("jQuery UI not loaded. Drag and Drop won't work.");
  }
});

// Alerts Popups functionality
function showAlert(type) {
  switch (type) {
    case 'simple':
      // For simple alert, show custom popup
      document.getElementById('alertMessage').innerText = 'This is a simple alert!';
      document.getElementById('customAlert').style.display = 'flex';
      break;

    case 'confirm':
      // Native confirm — no custom alert
      confirm('Do you confirm this action?');
      break;

    case 'prompt':
      // Native prompt — no custom alert
      prompt('Please enter your name:');
      break;

    default:
      console.warn('Unknown alert type.');
  }
}

function closeAlert() {
  document.getElementById('customAlert').style.display = 'none';
}

function openVideo(course) {
  let videoUrl = '';
  
  if (course === 'js') {
    videoUrl = 'https://youtube.com/playlist?list=PLUeDIlio4THEgPRVJRqZRS8uw8hhVNQCM';
  } else if (course === 'ts') {
    videoUrl = 'https://youtube.com/playlist?list=PLUeDIlio4THEXmQxNvKmdDxAVloGTHXMr';
  } else if (course === 'cypress') {
    videoUrl = 'https://youtube.com/playlist?list=PLUeDIlio4THEbdE2jWyBBxkWqjk4JmHHq';
  } else if (course === 'javascript') {
    videoUrl = 'https://youtube.com/playlist?list=PLUeDIlio4THFLrS29tJnP9yz-QKhn4mdB';
  } else if (course === 'api') {
    videoUrl = 'https://youtube.com/playlist?list=PLUeDIlio4THGaSQ_s5WFc2Mo7Ikne2kA5';
  }
  
  window.open(videoUrl, '_blank');
}
