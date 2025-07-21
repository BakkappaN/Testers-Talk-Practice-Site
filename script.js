const DUMMY_USER = "TestersTalk";
const DUMMY_PASS = "TestersTalk";



function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const appNameElement = document.getElementById("appName");
  const appName = appNameElement ? appNameElement.value : 'default';
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

    // Handle app selection
    if (appName === 'banking') {
      // Set login state before redirecting
      localStorage.setItem('loggedIn', 'true');

      // Show loading overlay for banking redirect
      document.getElementById("loadingOverlay").style.display = "flex";
      var loadingText = document.querySelector('.loading-text');
      if (loadingText) {
        loadingText.textContent = 'Redirecting to Banking App...';
      }

      // Add a delay to show spinner before redirecting
      setTimeout(() => {
        // Navigate to Banking-Project-Demo page
        try {
          window.location.replace('./Banking-Project-Demo.html');
        } catch (error) {
          console.error('Redirect failed:', error);
          window.location.href = './Banking-Project-Demo.html';
        }
      }, 1500); // 1.5 second delay to show spinner

      return;
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
      setLoginBackground(false);
      loadEmployees();
    }, 1000);
  } else {
    document.getElementById("loginError").innerText = "Invalid login! " + "try entering 'TestersTalk' as username and password.";
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

// Utility to set login background
function setLoginBackground(isLogin) {
  var loginSection = document.getElementById('loginSection');
  var mainFlex = document.querySelector('.main-flex');
  var banner = document.querySelector('.api-banner-fullwidth');
  if (isLogin) {
    document.body.classList.add('login-bg');
    if (loginSection) loginSection.classList.add('login-bg-section');
    if (mainFlex) mainFlex.classList.add('login-bg-flex');
    if (banner) banner.classList.add('login-banner-floating');
  } else {
    document.body.classList.remove('login-bg');
    if (loginSection) loginSection.classList.remove('login-bg-section');
    if (mainFlex) mainFlex.classList.remove('login-bg-flex');
    if (banner) banner.classList.remove('login-banner-floating');
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
  // Only show spinner if user was logged in before refresh
  const wasLoggedIn = localStorage.getItem('loggedIn') === 'true';
  if (isReload && wasLoggedIn) {
    // Show spinner with custom message
    var loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
      var loadingText = document.getElementsByClassName("loading-text")[0];
      if (loadingText) loadingText.textContent = "Refreshing... Logging you out. Please wait...";
    }
    // Hide login section and header during spinner
    var loginSection = document.getElementById('loginSection');
    if (loginSection) loginSection.style.display = 'none';
    var siteHeader = document.getElementById('siteHeader');
    if (siteHeader) siteHeader.style.display = 'none';
    var appDiv = document.getElementById('appDiv');
    if (appDiv) appDiv.style.display = 'none';
    var welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) welcomeMsg.style.display = 'none';
    localStorage.removeItem('loggedIn');
    setLoginBackground(true);
    setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
        if (loadingText) loadingText.textContent = "Logging in...";
      }
      if (loginSection) loginSection.style.display = '';
      if (siteHeader) siteHeader.style.display = '';
      setLoginBackground(true);
    }, 2000);
    return;
  }
  // Always load employees from localStorage on page load
  loadEmployees();
  // Auto-login if already logged in
  if (localStorage.getItem('loggedIn') === 'true') {
    setLoginBackground(false);
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
        setTimeout(function () {
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
  (function () {
    const section = document.querySelector('.scrollable-courses-section');
    if (!section) return;
    section.addEventListener('scroll', function () {
      if (section.scrollLeft > 0) { // Lowered threshold for instant feedback
        section.classList.add('scrolled');
      } else {
        section.classList.remove('scrolled');
      }
    });
  })();

  // Hide/show Logout button on scroll: only show when at top
  window.addEventListener('scroll', function () {
    var logoutBtn = document.getElementById('logoutLink');
    if (!logoutBtn) return;

    // Only apply scroll hiding if the logout button should be shown (user is logged in)
    if (logoutBtn.classList.contains('show')) {
      if (window.scrollY < 20) {
        logoutBtn.style.opacity = '1';
        logoutBtn.style.pointerEvents = 'auto';
      } else {
        logoutBtn.style.opacity = '0';
        logoutBtn.style.pointerEvents = 'none';
      }
    }
  });

  // Ensure logout button is visible immediately after login
  function ensureLogoutButtonVisible() {
    var logoutBtn = document.getElementById('logoutLink');
    if (logoutBtn && logoutBtn.classList.contains('show') && window.scrollY < 20) {
      logoutBtn.style.opacity = '1';
      logoutBtn.style.pointerEvents = 'auto';
    }
  }

  // Call this function after login to ensure button is visible
  setTimeout(ensureLogoutButtonVisible, 100);

  // If not logged in, show login background
  setLoginBackground(true);
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
(function () {
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
        showCustomAlert('You have been automatically logged out due to inactivity. Please log in again to continue.');
      }, LOGOUT_TIME);
    }
  }

  // Listen for user activity
  ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'].forEach(evt => {
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
        setTimeout(function () {
          const employees = JSON.parse(localStorage.getItem('employees')) || [];
          if (employees.length !== 0 || (tbody && tbody.children.length !== 0)) {
            location.reload();
          }
        }, 200);
      }
    };
  }
}

// Removed duplicate scroll event listener to fix logout button visibility

// Donate Now button color animation
(function () {
  const donateButton = document.querySelector('.api-playground-link[href="Donate-Now.html"]');
  if (!donateButton) return;

  const colorTriplets = [
    { bg1: '#ff6b6b', bg2: '#ff9ff3', bg3: '#5f27cd', text: 'white', border: '#ff6b6b' },   // Coral + Pink + Purple
    { bg1: '#feca57', bg2: '#ff6b6b', bg3: '#ff9ff3', text: '#333', border: '#feca57' },    // Golden + Coral + Pink
    { bg1: '#ff9ff3', bg2: '#5f27cd', bg3: '#00d2d3', text: 'white', border: '#ff9ff3' },   // Pink + Purple + Cyan
    { bg1: '#5f27cd', bg2: '#ff6b6b', bg3: '#4ecdc4', text: 'white', border: '#5f27cd' },   // Purple + Coral + Turquoise
    
    { bg1: '#ffea00', bg2: '#ff3d00', bg3: '#00e676', text: '#222', border: '#ffea00' }, // Yellow, Orange, Green
    { bg1: '#00b8d4', bg2: '#ff4081', bg3: '#ffd600', text: '#fff', border: '#00b8d4' }, // Cyan, Pink, Bright Yellow
    { bg1: '#ff1744', bg2: '#00e5ff', bg3: '#76ff03', text: '#fff', border: '#ff1744' }, // Red, Aqua, Lime
    { bg1: '#f50057', bg2: '#00bfae', bg3: '#ffea00', text: '#fff', border: '#f50057' }, // Pink, Teal, Yellow
    { bg1: '#ff6d00', bg2: '#00e676', bg3: '#2979ff', text: '#fff', border: '#ff6d00' }, // Orange, Green, Blue
    { bg1: '#d500f9', bg2: '#00b8d4', bg3: '#ffea00', text: '#fff', border: '#d500f9' }, // Purple, Cyan, Yellow
    { bg1: '#00e676', bg2: '#ff1744', bg3: '#ffd600', text: '#fff', border: '#00e676' }, // Green, Red, Yellow
    { bg1: '#2979ff', bg2: '#ffea00', bg3: '#f50057', text: '#fff', border: '#2979ff' }, // Blue, Yellow, Pink
    { bg1: '#ffd600', bg2: '#00bfae', bg3: '#ff3d00', text: '#222', border: '#ffd600' }, // Bright Yellow, Teal, Orange
    { bg1: '#00bfae', bg2: '#f50057', bg3: '#76ff03', text: '#fff', border: '#00bfae' }  // Teal, Pink, Lime
  ];

  let currentColorIndex = 0;

  function changeColor() {
    const colorTriplet = colorTriplets[currentColorIndex];
    const gradient = `linear-gradient(135deg, ${colorTriplet.bg1} 0%, ${colorTriplet.bg2} 50%, ${colorTriplet.bg3} 100%)`;
    donateButton.style.setProperty('background', gradient, 'important');
    donateButton.style.setProperty('color', colorTriplet.text, 'important');
    donateButton.style.setProperty('border-color', colorTriplet.border, 'important');

    currentColorIndex = (currentColorIndex + 1) % colorTriplets.length;
  }

  // Start the animation immediately
  changeColor();

  // Change color every 2 seconds
  setInterval(changeColor, 2000);
})();

// UPI App button color animation (Donate-Now.html)
(function () {
  var upiButton = document.querySelector('a[href^="upi://pay"]');
  if (!upiButton) return;

  // Brighter, more vibrant color palette
  const colorTriplets = [
    { bg1: '#ff6b6b', bg2: '#ff9ff3', bg3: '#5f27cd', text: 'white', border: '#ff6b6b' },   // Coral + Pink + Purple
    { bg1: '#feca57', bg2: '#ff6b6b', bg3: '#ff9ff3', text: '#333', border: '#feca57' },    // Golden + Coral + Pink
    { bg1: '#ff9ff3', bg2: '#5f27cd', bg3: '#00d2d3', text: 'white', border: '#ff9ff3' },   // Pink + Purple + Cyan
    { bg1: '#5f27cd', bg2: '#ff6b6b', bg3: '#4ecdc4', text: 'white', border: '#5f27cd' },   // Purple + Coral + Turquoise

    { bg1: '#ffea00', bg2: '#ff3d00', bg3: '#00e676', text: '#222', border: '#ffea00' }, // Yellow, Orange, Green
    { bg1: '#00b8d4', bg2: '#ff4081', bg3: '#ffd600', text: '#fff', border: '#00b8d4' }, // Cyan, Pink, Bright Yellow
    { bg1: '#ff1744', bg2: '#00e5ff', bg3: '#76ff03', text: '#fff', border: '#ff1744' }, // Red, Aqua, Lime
    { bg1: '#f50057', bg2: '#00bfae', bg3: '#ffea00', text: '#fff', border: '#f50057' }, // Pink, Teal, Yellow
    { bg1: '#ff6d00', bg2: '#00e676', bg3: '#2979ff', text: '#fff', border: '#ff6d00' }, // Orange, Green, Blue
    { bg1: '#d500f9', bg2: '#00b8d4', bg3: '#ffea00', text: '#fff', border: '#d500f9' }, // Purple, Cyan, Yellow
    { bg1: '#00e676', bg2: '#ff1744', bg3: '#ffd600', text: '#fff', border: '#00e676' }, // Green, Red, Yellow
    { bg1: '#2979ff', bg2: '#ffea00', bg3: '#f50057', text: '#fff', border: '#2979ff' }, // Blue, Yellow, Pink
    { bg1: '#ffd600', bg2: '#00bfae', bg3: '#ff3d00', text: '#222', border: '#ffd600' }, // Bright Yellow, Teal, Orange
    { bg1: '#00bfae', bg2: '#f50057', bg3: '#76ff03', text: '#fff', border: '#00bfae' }  // Teal, Pink, Lime
  ];

  let currentColorIndex = 0;

  function changeColor() {
    const colorTriplet = colorTriplets[currentColorIndex];
    const gradient = `linear-gradient(135deg, ${colorTriplet.bg1} 0%, ${colorTriplet.bg2} 50%, ${colorTriplet.bg3} 100%)`;
    upiButton.style.setProperty('background', gradient, 'important');
    upiButton.style.setProperty('color', colorTriplet.text, 'important');
    upiButton.style.setProperty('border-color', colorTriplet.border, 'important');
    currentColorIndex = (currentColorIndex + 1) % colorTriplets.length;
  }

  changeColor();
  setInterval(changeColor, 2000);
})();
