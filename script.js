// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Improve touch scrolling
document.addEventListener('touchstart', function (e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: true });

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const subscribeForm = document.querySelector(".subscribe");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const scrollProgress = document.getElementById("scroll-progress");

// Set current year
if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile navigation toggle
if (navToggle && navLinks) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    navToggle.classList.toggle("active");
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("active") && 
        !navLinks.contains(e.target) && 
        !navToggle.contains(e.target)) {
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Close menu on scroll (mobile)
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (navLinks.classList.contains("active")) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        navLinks.classList.remove("active");
        navToggle.classList.remove("active");
        document.body.style.overflow = "";
      }, 100);
    }
  }, { passive: true });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Scroll progress indicator
window.addEventListener("scroll", () => {
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
  }
}, { passive: true });

// Gallery lightbox
const galleryFigures = document.querySelectorAll(".gallery-grid figure");
galleryFigures.forEach((figure) => {
  figure.addEventListener("click", () => {
    const imageUrl = figure.getAttribute("data-image");
    if (imageUrl && lightbox && lightboxImg) {
      lightboxImg.src = imageUrl;
      lightboxImg.alt = figure.querySelector("figcaption")?.textContent || "";
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });
});

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Animated stats counter
const animateCounter = (element, target, duration = 2000) => {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        entry.target.classList.add("counted");
        const statNumber = entry.target.querySelector(".stat-number");
        if (statNumber) {
          const text = statNumber.textContent;
          const number = parseInt(text.replace(/\D/g, ""));
          if (!isNaN(number) && number > 0) {
            const originalText = statNumber.textContent;
            statNumber.textContent = "0";
            setTimeout(() => {
              animateCounter(statNumber, number);
              // Restore suffix if any (like "h" in "48h")
              setTimeout(() => {
                if (originalText.includes("h")) {
                  statNumber.textContent = number + "h";
                }
              }, 2100);
            }, 200);
          }
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stats > div").forEach((stat) => {
  statsObserver.observe(stat);
});

// Enhanced subscribe form
if (subscribeForm) {
  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = subscribeForm.querySelector("input[type='email']");
    const button = subscribeForm.querySelector("button");
    if (!input || !button) return;

    const value = input.value.trim();
    if (!value) {
      input.style.boxShadow = "inset 0 0 0 2px #c18474, 0 0 0 3px rgba(193, 132, 116, 0.2)";
      setTimeout(() => {
        input.style.boxShadow = "";
      }, 2000);
      return;
    }

    // Success animation
    button.textContent = "✓ Subscribed!";
    button.style.background = "var(--sage)";
    setTimeout(() => {
      button.textContent = "Notify me";
      button.style.background = "";
      input.value = "";
    }, 2000);
  });
}

// Parallax effect for hero (disabled on mobile for performance)
let isMobile = window.innerWidth <= 800;
window.addEventListener("resize", () => {
  isMobile = window.innerWidth <= 800;
});

window.addEventListener("scroll", () => {
  if (isMobile) return; // Disable parallax on mobile for better performance
  
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero && scrolled < window.innerHeight) {
    const parallax = scrolled * 0.3;
    const opacity = Math.max(0.3, 1 - scrolled / window.innerHeight);
    hero.style.transform = `translateY(${parallax}px)`;
    hero.style.opacity = opacity;
  }
}, { passive: true });

// Navbar background on scroll
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");
  const currentScroll = window.pageYOffset;
  
  if (nav) {
    if (currentScroll > 50) {
      nav.style.background = "rgba(244, 239, 233, 0.95)";
      nav.style.boxShadow = "0 10px 30px rgba(25, 23, 22, 0.1)";
    } else {
      nav.style.background = "rgba(244, 239, 233, 0.8)";
      nav.style.boxShadow = "";
    }
  }
  lastScroll = currentScroll;
}, { passive: true });

// Add ripple effect to buttons
document.querySelectorAll(".btn, .subscribe button").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Share functionality
function sharePage() {
  const url = window.location.href;
  const title = document.title;
  const text = "Check out Willow & Whisk Bakery + Café!";

  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url,
    })
      .then(() => {
        console.log("Shared successfully");
      })
      .catch((error) => {
        console.log("Error sharing:", error);
        fallbackShare(url, title, text);
      });
  } else {
    fallbackShare(url, title, text);
  }
}

function fallbackShare(url, title, text) {
  // Copy to clipboard
  const shareText = `${text}\n${url}`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText).then(() => {
      showShareNotification("Link copied to clipboard!");
    }).catch(() => {
      showShareOptions(url, title, text);
    });
  } else {
    showShareOptions(url, title, text);
  }
}

function showShareOptions(url, title, text) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);
  
  const shareMenu = document.createElement("div");
  shareMenu.className = "share-menu";
  shareMenu.innerHTML = `
    <div class="share-menu-content">
      <h3>Share this page</h3>
      <div class="share-options">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" class="share-option">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </a>
        <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}" target="_blank" class="share-option">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          <span>Twitter</span>
        </a>
        <a href="https://wa.me/?text=${encodedText}%20${encodedUrl}" target="_blank" class="share-option">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
        <button class="share-copy" onclick="copyToClipboard('${url}')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          <span>Copy Link</span>
        </button>
      </div>
      <button class="share-close" onclick="closeShareMenu()">Close</button>
    </div>
  `;
  document.body.appendChild(shareMenu);
  setTimeout(() => shareMenu.classList.add("active"), 10);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showShareNotification("Link copied to clipboard!");
      closeShareMenu();
    });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showShareNotification("Link copied to clipboard!");
      closeShareMenu();
    } catch (err) {
      showShareNotification("Failed to copy link");
    }
    document.body.removeChild(textarea);
  }
}

function closeShareMenu() {
  const menu = document.querySelector(".share-menu");
  if (menu) {
    menu.classList.remove("active");
    setTimeout(() => menu.remove(), 300);
  }
}

function showShareNotification(message) {
  const notification = document.createElement("div");
  notification.className = "share-notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Close share menu when clicking outside
document.addEventListener("click", (e) => {
  const shareMenu = document.querySelector(".share-menu");
  if (shareMenu && !shareMenu.contains(e.target) && !e.target.closest(".share-btn")) {
    closeShareMenu();
  }
});

// ==================== AUTHENTICATION ====================

// Check if user is logged in on page load
checkAuthStatus();

// Auth Modal Functions
function openAuthModal(type = 'login') {
  const modal = document.getElementById('auth-modal');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');

  if (!modal) return;

  // Hide all forms
  if (loginForm) loginForm.style.display = 'none';
  if (signupForm) signupForm.style.display = 'none';
  if (forgotForm) forgotForm.style.display = 'none';

  // Show selected form
  if (type === 'login' && loginForm) {
    loginForm.style.display = 'block';
  } else if (type === 'signup' && signupForm) {
    signupForm.style.display = 'block';
  } else if (type === 'forgot' && forgotForm) {
    forgotForm.style.display = 'block';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Scroll to top of modal on mobile
  if (window.innerWidth <= 800) {
    setTimeout(() => {
      const modalContent = document.querySelector('.auth-modal-content');
      if (modalContent) {
        modalContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function switchAuthForm(type) {
  openAuthModal(type);
}

function showForgotPassword() {
  openAuthModal('forgot');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('auth-modal');
  if (modal && e.target === modal) {
    closeAuthModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAuthModal();
  }
});

// Login Handler
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Set session
    const sessionData = {
      ...user,
      loginTime: new Date().toISOString()
    };
    
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
    }

    showNotification('Welcome back, ' + user.name + '!', 'success');
    closeAuthModal();
    checkAuthStatus();
    
    // Reset form
    event.target.reset();
  } else {
    showNotification('Invalid email or password', 'error');
  }
}

// Signup Handler
function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;

  // Validation
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    showNotification('Email already registered', 'error');
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name: name,
    email: email,
    phone: phone,
    password: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Auto login
  sessionStorage.setItem('currentUser', JSON.stringify({
    ...newUser,
    loginTime: new Date().toISOString()
  }));

  showNotification('Account created successfully!', 'success');
  closeAuthModal();
  checkAuthStatus();
  
  // Reset form
  event.target.reset();
}

// Forgot Password Handler
function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email);

  if (user) {
    showNotification('Password reset link sent to ' + email, 'success');
    closeAuthModal();
  } else {
    showNotification('Email not found', 'error');
  }
}

// Check Auth Status
function checkAuthStatus() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');
  const authNavItem = document.querySelector('.auth-nav-item');
  const loginBtn = document.querySelector('.login-btn');
  const signupBtn = document.querySelector('.signup-btn');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');

  if (currentUser && authNavItem) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (userMenu) {
      userMenu.style.display = 'block';
      if (userName) {
        userName.textContent = currentUser.name.split(' ')[0];
      }
    }
  } else {
    // User is not logged in
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (signupBtn) signupBtn.style.display = 'inline-block';
    if (userMenu) userMenu.style.display = 'none';
  }
}

// Logout
function logout() {
  sessionStorage.removeItem('currentUser');
  localStorage.removeItem('currentUser');
  showNotification('Logged out successfully', 'success');
  checkAuthStatus();
  toggleUserMenu();
  closeProfile();
}

// User Menu Toggle
function toggleUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('user-dropdown');
  if (userMenu && dropdown && !userMenu.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

// Profile Functions
function showProfile() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');
  const profileSection = document.getElementById('profile-section');
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profilePhone = document.getElementById('profile-phone');
  const profileInitial = document.getElementById('profile-initial');

  if (currentUser && profileSection) {
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone || 'Not provided';
    if (profileInitial) profileInitial.textContent = currentUser.name.charAt(0).toUpperCase();
    
    profileSection.style.display = 'block';
    profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toggleUserMenu();
  }
}

function closeProfile() {
  const profileSection = document.getElementById('profile-section');
  if (profileSection) {
    profileSection.style.display = 'none';
  }
}

function editProfile() {
  showNotification('Profile editing coming soon!', 'info');
}

function showOrders() {
  showNotification('Order history coming soon!', 'info');
  toggleUserMenu();
}

function showReservations() {
  showNotification('Reservations coming soon!', 'info');
  toggleUserMenu();
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `auth-notification ${type}`;
  notification.textContent = message;
  
  const colors = {
    success: '#6f8a6a',
    error: '#c18474',
    info: '#daaa63'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: ${colors[type] || colors.info};
    color: var(--cream);
    padding: 1rem 1.5rem;
    border-radius: 999px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 4000;
    opacity: 0;
    transform: translateX(100px);
    transition: all 300ms ease;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

