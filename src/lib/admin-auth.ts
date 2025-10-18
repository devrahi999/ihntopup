// Admin authentication utilities
export function verifyAdminCredentials(email: string, password: string): boolean {
  // Hardcoded admin credentials for demo purposes
  // In production, these should be stored securely and validated against a database
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@ihntopup.com';
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  
  return email === adminEmail && password === adminPassword;
}

export function setAdminSession(): void {
  // Set admin session in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminSession', 'true');
    localStorage.setItem('adminLoginTime', new Date().toISOString());
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('adminSession');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!session || !loginTime) {
      return false;
    }
    
    // Check if session is older than 24 hours
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      clearAdminSession();
      return false;
    }
    
    return true;
  }
  
  return false;
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminLoginTime');
  }
}

// Admin middleware for protected routes
export function requireAdminAuth() {
  if (typeof window !== 'undefined' && !isAdminLoggedIn()) {
    window.location.href = '/admin/login';
    return false;
  }
  return true;
}
