// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Clear previous error messages
            clearErrorMessages();
            
            // Validate form
            let isValid = true;
            
            // Validate First Name
            const firstName = document.getElementById('firstName');
            if (!firstName.value.trim()) {
                showError('firstNameError', 'First name is required');
                isValid = false;
            }
            
            // Validate Last Name
            const lastName = document.getElementById('lastName');
            if (!lastName.value.trim()) {
                showError('lastNameError', 'Last name is required');
                isValid = false;
            }
            
            // Validate Email
            const email = document.getElementById('email');
            const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            if (!email.value.trim()) {
                showError('emailError', 'Email address is required');
                isValid = false;
            } else if (!emailPattern.test(email.value)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate Password
            const password = document.getElementById('password');
            if (!password.value) {
                showError('passwordError', 'Password is required');
                isValid = false;
            } else if (password.value.length < 8) {
                showError('passwordError', 'Password must be at least 8 characters long');
                isValid = false;
            }
            
            // Validate Confirm Password
            const confirmPassword = document.getElementById('confirmPassword');
            if (!confirmPassword.value) {
                showError('confirmPasswordError', 'Please confirm your password');
                isValid = false;
            } else if (password.value !== confirmPassword.value) {
                showError('confirmPasswordError', 'Passwords do not match');
                isValid = false;
            }
            
            // If form is valid, redirect to thank you page
            if (isValid) {
                // In a real application, you would send the data to a server here
                // For this demo, we'll just redirect to the thank you page
                window.location.href = 'thankyou.html';
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                // Clear error message when user starts typing
                const errorElement = document.getElementById(input.id + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });
    }
});

function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    switch (fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                showError(fieldId + 'Error', 'This field is required');
                return false;
            }
            break;
            
        case 'email':
            const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            if (!value) {
                showError(fieldId + 'Error', 'Email address is required');
                return false;
            } else if (!emailPattern.test(value)) {
                showError(fieldId + 'Error', 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'password':
            if (!value) {
                showError(fieldId + 'Error', 'Password is required');
                return false;
            } else if (value.length < 8) {
                showError(fieldId + 'Error', 'Password must be at least 8 characters long');
                return false;
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!value) {
                showError(fieldId + 'Error', 'Please confirm your password');
                return false;
            } else if (value !== password) {
                showError(fieldId + 'Error', 'Passwords do not match');
                return false;
            }
            break;
    }
    
    return true;
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for form submission
function showLoadingState() {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
    }
}

function hideLoadingState() {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
    }
}

// Add animation to project cards on scroll
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Close mobile menu with Escape key
    if (event.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Add focus management for mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const firstNavLink = document.querySelector('.nav-menu a');
    const lastNavLink = document.querySelectorAll('.nav-menu a');
    const lastLink = lastNavLink[lastNavLink.length - 1];

    if (hamburger && navMenu && firstNavLink && lastLink) {
        hamburger.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                // Menu is opening, focus first link
                setTimeout(() => firstNavLink.focus(), 100);
            }
        });

        // Handle tab navigation in mobile menu
        firstNavLink.addEventListener('keydown', function(event) {
            if (event.key === 'Tab' && event.shiftKey) {
                // Shift + Tab on first link should close menu and focus hamburger
                event.preventDefault();
                hamburger.focus();
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        lastLink.addEventListener('keydown', function(event) {
            if (event.key === 'Tab' && !event.shiftKey) {
                // Tab on last link should close menu and focus hamburger
                event.preventDefault();
                hamburger.focus();
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});
