document.addEventListener('DOMContentLoaded', () => {
    const infoEl = document.getElementById('visitor-ip-info');
    if (!infoEl) return;

    loadVisitorLocation()
        .then((data) => {
            if (!data.ip) return;

            const locationParts = [data.city, data.region, data.country].filter(Boolean);
            const location = locationParts.length ? locationParts.join(', ') : 'Unknown location';

            infoEl.innerHTML = `
                <span class="visitor-ip-info__label">Your visit</span>
                <span class="visitor-ip-info__value">${escapeHtml(data.ip)}</span>
                <span class="visitor-ip-info__location">${escapeHtml(location)}</span>
            `;
        })
        .catch(() => {
            infoEl.hidden = true;
        });
});

async function loadVisitorLocation() {
    const providers = [
        'https://ipinfo.io/json',
        'https://api.ip.sb/geoip'
    ];

    let lastError;

    for (const url of providers) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Geolocation request failed');
            }

            const data = await response.json();
            if (!data.ip) {
                throw new Error('Missing IP address');
            }

            return data;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
