//  TIMEZONE LOOKUP 
function getTimeZone(placeName) {
    const name = placeName.toLowerCase();

    if (name.includes('sydney'))    return 'Australia/Sydney';
    if (name.includes('melbourne')) return 'Australia/Melbourne';
    if (name.includes('tokyo'))     return 'Asia/Tokyo';
    if (name.includes('kyoto'))     return 'Asia/Tokyo';
    if (name.includes('rio'))       return 'America/Sao_Paulo';
    if (name.includes('são'))       return 'America/Sao_Paulo';
    if (name.includes('sao'))       return 'America/Sao_Paulo';
    if (name.includes('copacabana'))return 'America/Sao_Paulo';
    if (name.includes('angkor'))    return 'Asia/Phnom_Penh';
    if (name.includes('taj'))       return 'Asia/Kolkata';
    if (name.includes('bora'))      return 'Pacific/Tahiti';

    return null;   // unknown — no time shown
}
function getLocalTime(timeZone) {
    if (!timeZone) return '';
    const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric'
    };
    return new Date().toLocaleTimeString('en-US', options);
}
// TRAVEL BOOM — Search Logic
let travelData = null;

// FETCH DATA
fetch('./travel_recommendation.json')
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log('Data loaded:', data);
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// DOM ELEMENTS
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

// SEARCH BUTTON 
searchBtn.addEventListener('click', function() {
    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword === '') {
        resultsDiv.innerHTML = '<p class="no-results">Please enter a search term.</p>';
        return;
    }

    if (!travelData) {
        resultsDiv.innerHTML = '<p class="no-results">Data still loading. Please wait a moment.</p>';
        return;
    }

    let matches = [];

    //  Keyword matching logic 
    if (keyword.includes('beach')) {
        matches = travelData.beaches;
    } else if (keyword.includes('temple')) {
        matches = travelData.temples;
    } else if (keyword.includes('countr')) {   // matches "country" and "countries"
        travelData.countries.forEach(country => {
            matches.push(...country.cities);
        });
    } else {
        // Search city names AND country names
        travelData.countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
                matches.push(...country.cities);
            }
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(keyword)) {
                    matches.push(city);
                }
            });
        });
    }

    renderResults(matches);
});

//  RENDER RESULTS 
function renderResults(items) {
    if (items.length === 0) {
        resultsDiv.innerHTML = '<p class="no-results">No matches found. Try "beach", "temple", "country", or a place name.</p>';
        return;
    }

    resultsDiv.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const timeZone = getTimeZone(item.name);
        const localTime = getLocalTime(timeZone);

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                ${localTime ? `<p class="local-time">🕒 Local time: ${localTime}</p>` : ''}
            </div>
        `;

        resultsDiv.appendChild(card);
    });
}
// CLEAR BUTTON 
clearBtn.addEventListener('click', function() {
    resultsDiv.innerHTML = '';
    searchInput.value = '';
    searchInput.focus();
});
