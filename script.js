const DUMMY_USER = "TestersTalk";
const DUMMY_PASS = "TestersTalk";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  if (user === DUMMY_USER && pass === DUMMY_PASS) {
    // Save credentials if rememberMe is checked
    if (rememberMe) {
      localStorage.setItem('savedUsername', user);
      localStorage.setItem('savedPassword', pass);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('savedUsername');
      localStorage.removeItem('savedPassword');
      localStorage.removeItem('rememberMe');
    }
    // Show loading overlay
    document.getElementById("loadingOverlay").style.display = "flex";
    
    // Wait for 1 second then proceed with login
    setTimeout(() => {
      document.getElementById("loadingOverlay").style.display = "none";
      // Hide the entire login section (header + containers)
      var loginSection = document.getElementById('loginSection');
      if (loginSection) loginSection.style.display = 'none';
      // Hide the header after login
      var siteHeader = document.getElementById('siteHeader');
      if (siteHeader) siteHeader.style.display = 'none';
      document.getElementById("appDiv").style.display = "block";
      // Show welcome message
      const welcomeMsg = document.getElementById("welcomeMsg");
      if (welcomeMsg) {
        welcomeMsg.style.display = "block";
      }
      // Show logout button
      var logoutBtn = document.getElementById('logoutLink');
      if (logoutBtn) logoutBtn.classList.add('show');
      // Set login state
      localStorage.setItem('loggedIn', 'true');
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
    // Handle post-auto-logout UI
    if (window._autoLoggedOut) {
        window._autoLoggedOut = false;
        var appDiv = document.getElementById('appDiv');
        if (appDiv) appDiv.style.display = 'none';
        var loginSection = document.getElementById('loginSection');
        if (loginSection) loginSection.style.display = '';
        var siteHeader = document.getElementById('siteHeader');
        if (siteHeader) siteHeader.style.display = '';
        var logoutBtn = document.getElementById('logoutLink');
        if (logoutBtn) logoutBtn.classList.remove('show');
        var welcomeMsg = document.getElementById('welcomeMsg');
        if (welcomeMsg) welcomeMsg.style.display = 'none';
    }
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
    // Save to localStorage for edit functionality
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    employees.unshift({ name, dept: department, dob, gender, technologies, country });
    // Keep only latest 10
    employees = employees.slice(0, 10);
    localStorage.setItem('employees', JSON.stringify(employees));
    // Always fetch fresh from localStorage for rendering
    renderEmployeeTable(JSON.parse(localStorage.getItem('employees')) || []);
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
    hideHeaderIfNotLogin();
    return true;
}

function renderEmployeeTable(employees) {
  // Always fetch fresh from localStorage if not provided
  if (!employees) {
    employees = JSON.parse(localStorage.getItem('employees')) || [];
  }
  const tbody = document.getElementById('empTableBody');
  tbody.innerHTML = '';
  employees.forEach((emp, idx) => {
    const row = `<tr>
      <td><a href="edit.html?idx=${idx}" style="color:#0d47a1; text-decoration:underline; cursor:pointer;">${emp.name}</a></td>
      <td>${emp.dept}</td>
      <td>${emp.dob}</td>
      <td>${emp.gender}</td>
      <td>${emp.technologies.join(", ")}</td>
      <td>${emp.country}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function loadEmployees() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  renderEmployeeTable(employees);
}

function hideHeaderIfNotLogin() {
  var loginSection = document.getElementById('loginSection');
  var siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    if (!loginSection || loginSection.style.display === 'none') {
      siteHeader.style.display = 'none';
    } else {
      siteHeader.style.display = '';
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Only force logout if this is a true browser refresh
  let isReload = false;
  if (performance.getEntriesByType && performance.getEntriesByType("navigation").length > 0) {
    isReload = performance.getEntriesByType("navigation")[0].type === "reload";
  } else if (performance.navigation) {
    isReload = performance.navigation.type === 1;
  }
  if (isReload) {
    localStorage.removeItem('loggedIn');
    // Always show login section and header, hide appDiv and welcomeMsg
    var loginSection = document.getElementById('loginSection');
    if (loginSection) loginSection.style.display = '';
    var siteHeader = document.getElementById('siteHeader');
    if (siteHeader) siteHeader.style.display = '';
    var appDiv = document.getElementById('appDiv');
    if (appDiv) appDiv.style.display = 'none';
    var welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) welcomeMsg.style.display = 'none';
  }
  // Always load employees from localStorage on page load
  loadEmployees();
  // Auto-login if already logged in
  if (localStorage.getItem('loggedIn') === 'true') {
    // Hide login section and YouTube course container
    var loginSection = document.getElementById('loginSection');
    if (loginSection) loginSection.style.display = 'none';
    var appDiv = document.getElementById('appDiv');
    if (appDiv) appDiv.style.display = 'block';
    const welcomeMsg = document.getElementById("welcomeMsg");
    if (welcomeMsg) welcomeMsg.style.display = "block";
    // Show logout button
    var logoutBtn = document.getElementById('logoutLink');
    if (logoutBtn) logoutBtn.classList.add('show');
    hideHeaderIfNotLogin();
    // --- Tab logic and clear rows logic always initialize after login ---
    initializeTabs();
    restoreActiveTab();
    initializeClearRowsBtn();
    return;
  }
  // Auto-fill credentials if saved
  if (localStorage.getItem('rememberMe') === 'true') {
    document.getElementById('username').value = localStorage.getItem('savedUsername') || '';
    document.getElementById('password').value = localStorage.getItem('savedPassword') || '';
    document.getElementById('rememberMe').checked = true;
  }
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
  initializeTabs();
  restoreActiveTab();
  // Clear All Rows button logic
  initializeClearRowsBtn();

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

  // Add event listener for Clear All Rows button
  const clearRowsBtn = document.getElementById('clearRowsBtn');
  if (clearRowsBtn) {
    clearRowsBtn.onclick = function () {
      if (confirm('Are you sure you want to clear all employee records?')) {
        localStorage.setItem('employees', JSON.stringify([]));
        const tbody = document.getElementById('empTableBody');
        if (tbody) tbody.innerHTML = '';
        loadEmployees(); // Refresh table from localStorage
        showCustomAlert('All employee records have been cleared!');
        // Edge fallback: if table not cleared, force reload
        setTimeout(function() {
          const employees = JSON.parse(localStorage.getItem('employees')) || [];
          if (employees.length !== 0 || (tbody && tbody.children.length !== 0)) {
            location.reload();
          }
        }, 200);
      }
    };
  }

  // Auto-advance YouTube course video every 5 seconds
  const nextVideoBtn = document.getElementById('nextVideo');
  if (nextVideoBtn) {
    setInterval(() => {
      // Only auto-advance if the button is visible (container is shown)
      if (nextVideoBtn.offsetParent !== null) {
        nextVideoBtn.click();
      }
    }, 20000);
  }

  // Show/hide last column in scrollable-courses-table on horizontal scroll
  (function() {
    const section = document.querySelector('.scrollable-courses-section');
    if (!section) return;
    section.addEventListener('scroll', function() {
      if (section.scrollLeft > 0) { // Lowered threshold for instant feedback
        section.classList.add('scrolled');
      } else {
        section.classList.remove('scrolled');
      }
    });
  })();

  // Hide/show Logout button on scroll: only show when at top
  window.addEventListener('scroll', function() {
    var logoutBtn = document.getElementById('logoutLink');
    if (!logoutBtn) return;
    if (window.scrollY < 20 && logoutBtn.classList.contains('show')) {
      logoutBtn.style.opacity = '1';
      logoutBtn.style.pointerEvents = 'auto';
    } else {
      logoutBtn.style.opacity = '0';
      logoutBtn.style.pointerEvents = 'none';
    }
  });
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
  const customAlert = document.getElementById('customAlert');
  customAlert.style.display = 'none';
  // Handle post-auto-logout UI
  if (window._autoLoggedOut) {
      window._autoLoggedOut = false;
      var appDiv = document.getElementById('appDiv');
      if (appDiv) appDiv.style.display = 'none';
      var loginSection = document.getElementById('loginSection');
      if (loginSection) loginSection.style.display = '';
      var siteHeader = document.getElementById('siteHeader');
      if (siteHeader) siteHeader.style.display = '';
      var logoutBtn = document.getElementById('logoutLink');
      if (logoutBtn) logoutBtn.classList.remove('show');
      var welcomeMsg = document.getElementById('welcomeMsg');
      if (welcomeMsg) welcomeMsg.style.display = 'none';
  }
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

// --- Auto Logout on Inactivity (3 minute) ---
(function() {
  let logoutTimer;
  const LOGOUT_TIME = 1800000; // 3 minute

  function resetLogoutTimer() {
    if (logoutTimer) clearTimeout(logoutTimer);
    if (localStorage.getItem('loggedIn') === 'true') {
      logoutTimer = setTimeout(() => {
        // Perform logout
        localStorage.removeItem('loggedIn');
        // Show alert and set flag, defer UI hiding to closeAlert
        window._autoLoggedOut = true;
        showCustomAlert('You have been automatically logged out due to 3 minute of inactivity. Please log in again to continue.');
      }, LOGOUT_TIME);
    }
  }

  // Listen for user activity
  ['mousemove','keydown','mousedown','touchstart','scroll'].forEach(evt => {
    window.addEventListener(evt, resetLogoutTimer, true);
  });

  // Start timer on page load if logged in
  if (localStorage.getItem('loggedIn') === 'true') {
    resetLogoutTimer();
  }
})();

// --- Tab logic helpers ---
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  tabButtons.forEach((btn, idx) => {
    btn.onclick = function () {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      tabContents[idx].classList.add("active");
      // Save active tab index
      localStorage.setItem('activeTabIdx', idx);
    };
  });
}

function restoreActiveTab() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  let idx = parseInt(localStorage.getItem('activeTabIdx'), 10);
  if (isNaN(idx) || idx < 0 || idx >= tabButtons.length) idx = 0;
  tabButtons.forEach(b => b.classList.remove("active"));
  tabContents.forEach(c => c.classList.remove("active"));
  if (tabButtons[idx]) tabButtons[idx].classList.add("active");
  if (tabContents[idx]) tabContents[idx].classList.add("active");
}

// --- Clear All Rows button logic helper ---
function initializeClearRowsBtn() {
  const clearRowsBtn = document.getElementById('clearRowsBtn');
  if (clearRowsBtn) {
    clearRowsBtn.onclick = function () {
      if (confirm('Are you sure you want to clear all employee records?')) {
        localStorage.setItem('employees', JSON.stringify([]));
        const tbody = document.getElementById('empTableBody');
        if (tbody) tbody.innerHTML = '';
        loadEmployees(); // Refresh table from localStorage
        showCustomAlert('All employee records have been cleared!');
        // Edge fallback: if table not cleared, force reload
        setTimeout(function() {
          const employees = JSON.parse(localStorage.getItem('employees')) || [];
          if (employees.length !== 0 || (tbody && tbody.children.length !== 0)) {
            location.reload();
          }
        }, 200);
      }
    };
  }
}

// Hide Logout button on scroll, show only at top
window.addEventListener('scroll', function() {
  var logoutBtn = document.querySelector('.logout-link');
  if (!logoutBtn) return;
  if (window.scrollY > 10) {
    logoutBtn.classList.add('hide-on-scroll');
  } else {
    logoutBtn.classList.remove('hide-on-scroll');
  }
});
