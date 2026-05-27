// Memorare ID uri echipe favorite
let activeFavoriteIds = [];


//Afisare echipe favorite


async function TeamsAlreadySaved() {
    try {
        const response = await fetchFavorites();
        const teams = await response.json();
        activeFavoriteIds = teams.map(team => team.id);
        console.log("Favorite Teams ID:", activeFavoriteIds);
    } catch (error) {
        console.error("The server doesn't work", error);
        activeFavoriteIds = [];
    }
}


//Creare MatchCard pentru fiecare meci din fiecare liga


function createMatchCard(match) {
    console.log("Acesta este meciul primit de la API:", match);
    const time = new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const homeName = customName[match.homeTeam.name] || match.homeTeam.name;
    const awayName = customName[match.awayTeam.name] || match.awayTeam.name;
    const homeCrest = customLogos[match.homeTeam.name] || match.homeTeam.crest;
    const awayCrest = customLogos[match.awayTeam.name] || match.awayTeam.crest;
    const homeScore = match.score.fullTime.home !== null ? match.score.fullTime.home : '-';
    const awayScore = match.score.fullTime.away !== null ? match.score.fullTime.away : '-';
    const homeId = match.homeTeam.id;
    const awayId = match.awayTeam.id;

    const isHomeFav = activeFavoriteIds.includes(homeId);
    const isAwayFav = activeFavoriteIds.includes(awayId);

    let timeDisplay = "";
    if (match.status === 'IN_PLAY') {
        timeDisplay = `<span class="live-indicator">LIVE</span>`;
    } else {
        timeDisplay = `<span class="match-time">${time}</span>`;
    }

    return `
        <div class="match-card">
            <div class="match-time">${timeDisplay}</div>
            
            <div class="match-divider"></div>
            
            <div class="match-content">
                <div class="team-row">
                    <div class="team-info">
                        <button type="button" class="star-btn ${isHomeFav ? 'active' : ''}" onclick="toggleFavorite(this, ${homeId}, '${homeName}', '${homeCrest}')">
                            ${isHomeFav ? '★' : '☆'}
                        </button>
                        <img src="${homeCrest}" alt="Logo" class="team-logo">
                        <span class="team-name">${homeName}</span>
                    </div>
                    <span class="team-score">${homeScore}</span>
                </div>
                <div class="team-row">
                    <div class="team-info">
                        <button type="button" class="star-btn ${isAwayFav ? 'active' : ''}" onclick="toggleFavorite(this, ${awayId}, '${awayName}', '${awayCrest}')">
                            ${isAwayFav ? '★' : '☆'}
                        </button>
                        <img src="${awayCrest}" alt="Logo" class="team-logo">
                        <span class="team-name">${awayName}</span>
                    </div>
                    <span class="team-score">${awayScore}</span>
                </div>
            </div>
        </div>
    `;
    
}



//Afisare meciuri din ziua curenta


function renderMatches(matches, date) {
    document.getElementById('no-matches-msg').style.display = 'none';
    // Resetăm toate secțiunile
    document.querySelectorAll('.league-section').forEach(section => {
        section.style.display = 'none';
        section.querySelector('.matches-list').innerHTML = '';
    });

    document.querySelectorAll('#filters-container .filter-btn').forEach(btn => {
            btn.style.display = 'none';
    });

    let FoundMatches = false;

    matches.forEach(match => {
        const section = document.getElementById(match.competition.code);
        if (!section) return; 
        FoundMatches = true;
        section.style.display = 'block';
        section.querySelector('.matches-list').innerHTML += createMatchCard(match);
        
        const allButton = document.querySelector('#filters-container .filter-btn[data-league="ALL"]');
        if (allButton) {
            allButton.style.display = 'block'; // sau 'block', în funcție de CSS
        }

        const associatedButton = document.querySelector(`#filters-container .filter-btn[data-league="${match.competition.code}"]`);
        if (associatedButton) {
            associatedButton.style.display = 'flex';
        }
    });

    if(FoundMatches == false)
    {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const SelectedDate = `${monthName} ${day}, ${year}`;
        document.getElementById('empty-date-text').innerHTML = SelectedDate;
        document.getElementById('no-matches-msg').style.display = 'block';
    }
}


//Navigare pe zile

async function changeDay(day) {
    
    const allButtons = document.querySelectorAll('.date-btn');
    allButtons.forEach(btn => btn.classList.remove('active')); 

    const targetBtn = document.getElementById(`btn-day-${day}`);
    
    // Dacă am găsit butonul (adică nu am ales din calendar o dată din anul 2025), îl facem albastru
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-league="ALL"]').classList.add('active');

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + day);

    myCalendar.setDate(targetDate);

    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1); 

    const dateFrom = formatDateString(targetDate);
    const dateTo = formatDateString(nextDay);

    try {
        const response = await fetchMatches(dateFrom, dateTo);
        const data = await response.json();
        renderMatches(data.matches, targetDate);
    } catch (error) {
        console.error("Error at getting matches:", error);
    }
}


//Butoane pentru data actualizata zilnic


function generateDateButtons()
{
    const container = document.getElementById('dynamic-date-filters');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for(let day = -1; day<=5; day++)
    {
        const btn = document.createElement('button');
        btn.className = 'date-btn';
        btn.id = `btn-day-${day}`;

        if(day == -1) btn.innerText = 'Yesterday';
        else if(day == 0) 
            {
                btn.innerText = 'Today';
                btn.classList.add('active');
            }
        else if(day == 1) btn.innerText = 'Tomorrow';
        else
        {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + day);
            const indexZi = targetDate.getDay();
            btn.innerText = days[indexZi];
        }
        btn.onclick = () => changeDay(day);
        container.appendChild(btn);
    }
}


//Calendar

const myCalendar = flatpickr("#custom-calendar-btn", {
    // Când utilizatorul alege o zi din calendar, executăm funcția noastră:
    onChange: function(selectedDates, dateStr, instance) {
        // dateStr vine automat în formatul YYYY-MM-DD
        handleCalendarSelection(dateStr);
    }
});

function handleCalendarSelection(selectedDateText) {
    if (!selectedDateText) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(selectedDateText);
    selectedDate.setHours(0, 0, 0, 0);

    const diffTime = selectedDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    changeDay(diffDays);
}


//Filtrare pe Ligi



function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const sections = document.querySelectorAll('.league-section');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedLeague = btn.getAttribute('data-league');

            sections.forEach(section => {
                const hasMatches = section.querySelector('.matches-list').innerHTML.trim() !== '';

                if (selectedLeague === 'ALL') {
                    section.style.display = hasMatches ? 'block' : 'none';
                } else {
                    section.style.display = (section.id === selectedLeague && hasMatches) ? 'block' : 'none';
                }
            });
        });
    });
}


//Dropdown pentru fiecare liga


function Dropdown() {
    const headers = document.querySelectorAll('.league-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('collapsed');
        });
    });
}



//Functie Adaugare/Stergere Favorite


async function toggleFavorite(buttonElement, teamId, teamName, teamLogo) {
    if (buttonElement.classList.contains("active")) {
        buttonElement.classList.remove("active");
        buttonElement.innerText = "☆";
        activeFavoriteIds = activeFavoriteIds.filter(id => id !== teamId);
        try {
            await deleteFavorite(teamId);
            console.log(`Removed ${teamName} from favorites.`);
        } catch (error) {
            console.error("Error connecting to Java backend", error);
        }
    } else {
        buttonElement.classList.add("active");
        buttonElement.innerText = "★";
        const teamData = {
            id: teamId,       // ID-ul oficial din API (ex: 66 pentru Liverpool)
            name: teamName,   // Numele (ex: Liverpool)
            logoUrl: teamLogo // URL-ul pozei de la API
        };
        try {
            const response = await addFavorite(teamData);
            const message = await response.text();
            console.log("Java says: " + message);
        } catch (error) {
            console.error("Error connecting to Java backend", error);
        }
    }
}

generateDateButtons();
setupFilters();
Dropdown();
TeamsAlreadySaved().then(() => changeDay(0));



