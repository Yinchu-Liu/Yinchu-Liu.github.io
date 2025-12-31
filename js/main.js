// Mobile Navigation
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll reveal animation
window.addEventListener('scroll', revealElements);

function revealElements() {
    const elements = document.querySelectorAll('.section');
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For now, we'll just log it to the console and show a success message
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Add active class to sections for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add a slight delay to ensure all elements are loaded
    setTimeout(() => {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('active');
        });
    }, 300);
});

// Typing animation for hero section
document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Add CSS class for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const addAnimation = (elements, className, delay = 0) => {
        setTimeout(() => {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add(className);
                }, 150 * index);
            });
        }, delay);
    };
    
    // Animate skill items
    addAnimation(document.querySelectorAll('.skill-item'), 'animate-in', 500);
    
    // Animate project cards
    addAnimation(document.querySelectorAll('.project-card'), 'animate-in', 700);
    
    // Animate timeline items
    addAnimation(document.querySelectorAll('.timeline-item'), 'animate-in', 900);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-item, .project-card, .timeline-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .skill-item.animate-in, .project-card.animate-in, .timeline-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Visitor IP and Information Display
document.addEventListener('DOMContentLoaded', () => {
    // Display current visitor's IP and information
    const visitorIpElement = document.getElementById('current-visitor-ip');
    const visitorLocationElement = document.getElementById('current-visitor-location');
    const visitorBrowserElement = document.getElementById('current-visitor-browser');
    
    if (visitorIpElement) {
        // Get browser information
        const browserInfo = getBrowserInfo();
        if (visitorBrowserElement) {
            visitorBrowserElement.textContent = browserInfo;
        }
        
        // Fetch IP address
        fetchVisitorIP()
            .then(ip => {
                visitorIpElement.textContent = ip;
                return fetchVisitorLocation(ip);
            })
            .then(locationData => {
                if (locationData && visitorLocationElement) {
                    const location = locationData.country || 'Unknown';
                    const city = locationData.city || '';
                    const region = locationData.region || '';
                    const locationString = city && region 
                        ? `${city}, ${region}, ${location}` 
                        : location;
                    visitorLocationElement.textContent = locationString;
                } else if (visitorLocationElement) {
                    visitorLocationElement.textContent = 'Unable to determine';
                }
            })
            .catch(error => {
                console.error('Error fetching visitor data:', error);
                if (visitorIpElement) visitorIpElement.textContent = 'Unable to retrieve';
                if (visitorLocationElement) visitorLocationElement.textContent = 'Unable to determine';
            });
    }
    
    // Ensure ClustrMaps loads properly
    const clustrMapsContainer = document.getElementById('clustrmaps-globe-container');
    if (clustrMapsContainer && !document.getElementById('clstr_globe')) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'clstr_globe';
        script.src = 'https://clustrmaps.com/globe.js?d=lsn-VUYeT27u9BP7laJazr2bCaLN0kVGr3yYLxh0eXM&w=300&t=n';
        script.async = true;
        clustrMapsContainer.appendChild(script);
    }
});

// Function to get browser information
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
        browser = 'Chrome';
    } else if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        browser = 'Safari';
    } else if (ua.indexOf('Edg') > -1) {
        browser = 'Edge';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
        browser = 'Opera';
    }
    
    return browser;
}

// Function to fetch visitor IP
async function fetchVisitorIP() {
    const ipApis = [
        'https://api.ipify.org?format=json',
        'https://api64.ipify.org?format=json',
        'https://ipapi.co/ip/'
    ];
    
    for (const api of ipApis) {
        try {
            if (api.includes('ipify')) {
                const response = await fetch(api);
                const data = await response.json();
                return data.ip;
            } else {
                const response = await fetch(api);
                const text = await response.text();
                return text.trim();
            }
        } catch (e) {
            continue;
        }
    }
    throw new Error('All IP APIs failed');
}

// Function to fetch visitor location
async function fetchVisitorLocation(ip) {
    const locationApis = [
        `https://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,query`,
        `https://ipapi.co/${ip}/json/`
    ];
    
    for (const api of locationApis) {
        try {
            const response = await fetch(api);
            const data = await response.json();
            
            if (api.includes('ip-api.com')) {
                if (data.status === 'success') {
                    return {
                        country: data.country,
                        city: data.city,
                        region: data.regionName,
                        latitude: data.lat,
                        longitude: data.lon
                    };
                }
            } else {
                if (!data.error && data.country_name) {
                    return {
                        country: data.country_name,
                        city: data.city,
                        region: data.region,
                        latitude: data.latitude,
                        longitude: data.longitude
                    };
                }
            }
        } catch (e) {
            continue;
        }
    }
    return null;
}
