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

// Visitor IP Tracking
document.addEventListener('DOMContentLoaded', () => {
    const visitorIpElement = document.getElementById('visitor-ip');
    const visitorLocationElement = document.getElementById('visitor-location');
    const visitorMapCanvas = document.getElementById('visitor-map-canvas');
    
    // Debug: Check if elements exist
    if (!visitorIpElement || !visitorLocationElement) {
        console.error('Visitor map elements not found');
        return;
    }
    
    if (visitorIpElement && visitorLocationElement) {
        let visitorIp = '';
        
        // Try multiple IP APIs with better CORS support
        const ipApis = [
            'https://api.ipify.org?format=json',
            'https://api64.ipify.org?format=json',
            'https://ipapi.co/ip/'
        ];
        
        // Function to get IP
        const getIP = async () => {
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
        };
        
        // Function to get location
        const getLocation = async (ip) => {
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
                                longitude: data.lon,
                                ip: data.query
                            };
                        }
                    } else {
                        if (!data.error && data.country_name) {
                            return {
                                country: data.country_name,
                                city: data.city,
                                region: data.region,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                ip: ip
                            };
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            return null;
        };
        
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (visitorIpElement.textContent === 'Loading...') {
                visitorIpElement.textContent = 'Request timeout';
                visitorLocationElement.textContent = 'Please refresh the page';
                loadClustrMaps();
            }
        }, 10000); // 10 second timeout
        
        // Main execution
        getIP()
            .then(ip => {
                clearTimeout(timeout);
                visitorIp = ip;
                visitorIpElement.textContent = ip;
                return getLocation(ip);
            })
            .then(locationData => {
                clearTimeout(timeout);
                if (locationData && locationData.country) {
                    const location = locationData.country;
                    const city = locationData.city || '';
                    const region = locationData.region || '';
                    const locationString = city && region 
                        ? `${city}, ${region}, ${location}` 
                        : location;
                    visitorLocationElement.textContent = locationString;
                    
                    // Display on map
                    if (locationData.latitude && locationData.longitude) {
                        displayVisitorOnMap(locationData.latitude, locationData.longitude, visitorIp);
                    } else {
                        loadClustrMaps();
                    }
                } else {
                    visitorLocationElement.textContent = 'Unable to determine location';
                    loadClustrMaps();
                }
            })
            .catch(error => {
                clearTimeout(timeout);
                console.error('Error fetching visitor data:', error);
                visitorIpElement.textContent = 'Unable to retrieve';
                visitorLocationElement.textContent = 'Unable to determine location';
                loadClustrMaps();
            });
    }
    
    function loadClustrMaps() {
        // Fallback to ClustrMaps if custom solution fails
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'clstr_globe';
        script.src = 'https://clustrmaps.com/globe.js?d=lsn-VUYeT27u9BP7laJazr2bCaLN0kVGr3yYLxh0eXM&w=300&t=n';
        script.async = true;
        if (visitorMapCanvas) {
            visitorMapCanvas.appendChild(script);
        }
    }
    
    function displayVisitorOnMap(lat, lon, ip) {
        // Use Leaflet.js for interactive map
        if (!window.L) {
            // Load Leaflet CSS and JS
            const leafletCSS = document.createElement('link');
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(leafletCSS);
            
            const leafletJS = document.createElement('script');
            leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletJS.onload = () => initMap(lat, lon, ip);
            document.head.appendChild(leafletJS);
        } else {
            initMap(lat, lon, ip);
        }
    }
    
    function initMap(lat, lon, ip) {
        if (visitorMapCanvas) {
            visitorMapCanvas.innerHTML = '';
            visitorMapCanvas.style.width = '100%';
            visitorMapCanvas.style.height = '400px';
            visitorMapCanvas.style.maxWidth = '800px';
            visitorMapCanvas.style.margin = '0 auto';
            visitorMapCanvas.style.borderRadius = '10px';
            visitorMapCanvas.style.overflow = 'hidden';
            
            const map = L.map(visitorMapCanvas).setView([lat, lon], 5);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            const marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(`<b>Visitor IP:</b><br>${ip}`).openPopup();
        }
    }
});
