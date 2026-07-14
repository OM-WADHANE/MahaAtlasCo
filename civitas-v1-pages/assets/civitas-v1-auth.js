/* civitas-v1-auth.js
   Authentication Guard — MahaAtlas
   Protects all pages - redirects to login if not authenticated
*/
(function() {
  
  // Check if user is authenticated
  function checkAuthentication() {
    const currentPage = window.location.pathname;
    const isAdminPage = currentPage.includes('admin.html');
    
    // Allow access to admin.html (login page) without authentication
    if (isAdminPage) {
      return;
    }
    
    // Check for authentication token
    const token = sessionStorage.getItem('mahaatlas_auth_token');
    const user = sessionStorage.getItem('mahaatlas_auth_user');
    const role = sessionStorage.getItem('mahaatlas_auth_role');
    
    // If not authenticated, redirect to login
    if (token !== 'authenticated' || !user || !role) {
      window.location.href = './admin.html';
      return;
    }
    
    // If authenticated, show content
    console.log('✓ Authenticated as:', user, '(', role, ')');
  }
  
  // Run authentication check immediately
  checkAuthentication();
  
  // Add logout button to header
  window.addEventListener('DOMContentLoaded', function() {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('logoutHeaderBtn')) {
      // Add user info and logout button
      const user = sessionStorage.getItem('mahaatlas_auth_user');
      const role = sessionStorage.getItem('mahaatlas_auth_role');
      
      if (user && role) {
        const userDisplay = role === 'admin' ? '⚙️' : '👤';
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutHeaderBtn';
        logoutBtn.className = 'h-btn';
        logoutBtn.innerHTML = userDisplay + ' Logout';
        logoutBtn.title = 'Logout from MahaAtlas';
        logoutBtn.onclick = function() {
          if (confirm('Are you sure you want to logout?')) {
            sessionStorage.clear();
            window.location.href = './admin.html';
          }
        };
        
        // Insert before theme toggle
        const themeToggle = headerActions.querySelector('.theme-toggle');
        if (themeToggle) {
          headerActions.insertBefore(logoutBtn, themeToggle);
        } else {
          headerActions.insertBefore(logoutBtn, headerActions.firstChild);
        }
      }
    }
  });
  
})();
