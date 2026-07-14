/* civitas-v1-admin.js
   Authentication — MahaAtlas
   Civitas Atlas Technologies
*/
(function () {

  // ─── CREDENTIALS (MVP — move to backend before public launch) ───
  const ACCOUNTS = [
    // Admin account
    { username: "admin",   password: "MahaAtlas@Admin",  role: "admin"  },
    // User accounts
    { username: "civitas", password: "Civitas@Atlas1",   role: "user"   },
    { username: "mahauser",password: "MahaAtlas@User2",  role: "user"   },
    { username: "atlasuser",password: "Atlas@Maha2024",  role: "user"   }
  ];

  const loginScreen  = document.getElementById("adminLoginScreen");
  const dashboard    = document.getElementById("adminDashboard");
  const loginForm    = document.getElementById("loginForm");
  const errorDiv     = document.getElementById("adminError");
  const logoutBtn    = document.getElementById("adminLogoutBtn");

  // Check if already logged in
  function checkAuth() {
    const token = sessionStorage.getItem("mahaatlas_auth_token");
    const role  = sessionStorage.getItem("mahaatlas_auth_role");
    if (token === "authenticated" && role) {
      showDashboard(role);
    }
  }

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value;
      const btn      = document.getElementById("loginSubmitBtn");
      const btnText  = document.getElementById("loginBtnText");

      errorDiv.classList.remove("show");
      btn.disabled = true;
      btnText.textContent = "Signing in...";

      setTimeout(function() {
        const account = ACCOUNTS.find(a =>
          a.username.toLowerCase() === username.toLowerCase() && a.password === password
        );

        if (account) {
          sessionStorage.setItem("mahaatlas_auth_token", "authenticated");
          sessionStorage.setItem("mahaatlas_auth_user",  account.username);
          sessionStorage.setItem("mahaatlas_auth_role",  account.role);
          showDashboard(account.role);
        } else {
          errorDiv.textContent = "Invalid username or password.";
          errorDiv.classList.add("show");
          btn.disabled = false;
          btnText.textContent = "Sign In";
        }
      }, 700);
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      sessionStorage.clear();
      loginScreen.style.display = "flex";
      dashboard.classList.remove("active");
      document.getElementById("loginUsername").value = "";
      document.getElementById("loginPassword").value = "";
    });
  }

  // Show dashboard or redirect
  function showDashboard(role) {
    if (role === "user") {
      window.location.href = "./index.html";
      return;
    }
    // admin — show dashboard
    loginScreen.style.display = "none";
    dashboard.classList.add("active");
    loadDashboardData();
  }

  // Load dashboard data
  function loadDashboardData() {
    setTimeout(updateStats, 300);
    setInterval(updateStats, 30000);
  }

  function updateStats() {
    var s = {
      searches:  Math.floor(12000 + Math.random() * 2000),
      documents: Math.floor(3000  + Math.random() * 500),
      users:     Math.floor(8000  + Math.random() * 1000),
      ai:        Math.floor(45000 + Math.random() * 2000)
    };
    var ids = ["statSearches","statDocuments","statUsers","statAI"];
    var vals = [s.searches, s.documents, s.users, s.ai];
    ids.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (el) el.textContent = vals[i].toLocaleString();
    });
  }

  // Tab switching
  document.querySelectorAll(".admin-tab").forEach(function(tab) {
    tab.addEventListener("click", function() {
      document.querySelectorAll(".admin-tab").forEach(function(t){ t.classList.remove("active"); });
      document.querySelectorAll(".admin-tab-content").forEach(function(tc){ tc.classList.remove("active"); });
      tab.classList.add("active");
      var target = document.getElementById("tab-" + tab.getAttribute("data-tab"));
      if (target) target.classList.add("active");
    });
  });

  checkAuth();

  // Basic devtools protection
  document.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  document.addEventListener("keydown", function(e){
    if (e.keyCode === 123 ||
       (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
       (e.ctrlKey && e.keyCode === 85)) {
      e.preventDefault();
    }
  });

})();
