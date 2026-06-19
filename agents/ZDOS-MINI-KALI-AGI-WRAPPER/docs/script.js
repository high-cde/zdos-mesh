// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.3)';
    } else {
        navbar.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.1)';
    }
});

// Terminal animation effect
function animateTerminal() {
    const terminalBody = document.querySelector('.terminal-body');
    const lines = terminalBody.querySelectorAll('p');
    
    lines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.2}s forwards`;
    });
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes glow {
        0%, 100% {
            text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }
        50% {
            text-shadow: 0 0 20px rgba(0, 255, 65, 1);
        }
    }

    .feature-card:hover .feature-icon {
        animation: glow 1s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Trigger terminal animation on page load
document.addEventListener('DOMContentLoaded', function() {
    animateTerminal();
    
    // Add intersection observer for fade-in effects on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards and usage cards
    document.querySelectorAll('.feature-card, .usage-card, .step').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Copy to clipboard functionality for code blocks
document.querySelectorAll('code').forEach(codeBlock => {
    codeBlock.style.cursor = 'pointer';
    codeBlock.title = 'Click to copy';
    
    codeBlock.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = this.textContent;
            this.textContent = '✓ Copied!';
            this.style.color = '#00ff41';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
            }, 2000);
        });
    });
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press '?' for help
    if (event.key === '?') {
        console.log('ZDOS MINI-KALI AGI WRAPPER - Keyboard Shortcuts:');
        console.log('? - Show this help');
        console.log('g - Go to GitHub');
        console.log('d - Go to Documentation');
    }
    
    // Press 'g' to go to GitHub
    if (event.key === 'g' && !event.ctrlKey && !event.metaKey) {
        window.open('https://github.com/high-cde/ZDOS-MINI-KALI-AGI-WRAPPER', '_blank');
    }
});

// Log welcome message to console
console.log('%cWelcome to ZDOS MINI-KALI AGI WRAPPER', 'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
console.log('%cAn Elite Cybersecurity Framework for Threat Hunting and Automated Hardening', 'color: #ff006e; font-size: 14px;');
console.log('%cGitHub: https://github.com/high-cde/ZDOS-MINI-KALI-AGI-WRAPPER', 'color: #00ff41; font-size: 12px;');
