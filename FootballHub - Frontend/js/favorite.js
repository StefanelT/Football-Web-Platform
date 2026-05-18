const TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

//Extrage urmatorul meci


async function getNextMatch(teamId) {
    try {
        const hadError = sessionStorage.getItem(`api_error_${teamId}`);
        let response;
        if (hadError) {
            const cacheBuster = Date.now();
            response = await fetch(
                `${FOOTBALL_BASE_URL.replace('?', `?cb=${cacheBuster}&`)}/teams/${teamId}/matches?status=SCHEDULED`,
                { method: 'GET', headers: { 'X-Auth-Token': API_KEY } }
            );
        } else {
            response = await fetchNextMatch(teamId);
        }

        console.log(`TeamID: ${teamId} | Status: ${response.status}`);

        if (response.status === 429) {
            return { 
                opponent_n: "API Rate Limit", 
                opponent_l: TRANSPARENT_PIXEL, 
                date: "Refresh in one minute" 
            };
        }

        sessionStorage.removeItem(`api_error_${teamId}`);
        
        const data = await response.json();
        
        if (!data.matches || data.matches.length === 0) {
            return { opponent_n: "No match scheduled", opponent_l: TRANSPARENT_PIXEL, date: "TBD" };
        }

        const nextMatch = data.matches[0];
        const isHome = nextMatch.homeTeam.id === parseInt(teamId);
        const rawOpponentName = isHome ? nextMatch.awayTeam.name : nextMatch.homeTeam.name;
        const rawOpponentLogo = isHome ? nextMatch.awayTeam.crest : nextMatch.homeTeam.crest;
        
        const opponentName = customName[rawOpponentName] || rawOpponentName;
        const opponentLogo = customLogos[rawOpponentName] || rawOpponentLogo || TRANSPARENT_PIXEL;

        // Formatăm doar Data și Ora (Ex: "May 15 at 22:00")
        const matchDateObj = new Date(nextMatch.utcDate);
        const time = matchDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${months[matchDateObj.getMonth()]} ${matchDateObj.getDate()} at ${time}`;

        return {
            opponent_n: opponentName,
            opponent_l: opponentLogo,
            date: `🕒 ${formattedDate}`
        };

    } catch (error) {
        console.error(`Error fetching match for team ${teamId}:`, error);
        return { opponent_n: "Error loading match", opponent_l: TRANSPARENT_PIXEL, date: "API Error" };
    }
}



//Incarcare Echipe Favorite

async function loadFavorites() {
    try {
        const response = await fetchFavorites();
        const teams = await response.json();
        
        const container = document.getElementById("favorites-container");
        container.innerHTML = "";

        if (teams.length === 0) {
            container.innerHTML = "<p style='color: #64748b; font-weight: 600; text-align: center; margin-top: 20px;'>No favorite teams added yet.</p>";
            return;
        }

        let htmlBuffer = "";

        
        for (const team of teams) {
            console.log(`Send request for ${team.name}`);
            const logo = customLogos[team.name] || team.logoUrl || TRANSPARENT_PIXEL;
            const matchInfo = await getNextMatch(team.id);

            htmlBuffer += `
                <div class="favorite-card">
                    <div class="card-header">
                        <div class="team-info">
                            <img src="${logo}" class="team-logo" alt="${team.name}">
                            <div class="team-name">${team.name}</div>
                        </div>
                        <button class="delete-btn" onclick="deleteTeam(${team.id})">🗑️</button>
                    </div>

                    <div class="next-match-card">
                        <div class="match-left">
                            <div class="match-logos">
                                <img src="${matchInfo.opponent_l}" class="mini-logo" onerror="this.src='${TRANSPARENT_PIXEL}'">
                            </div>
                            <div class="match-details">
                                <div class="versus-text">vs ${matchInfo.opponent_n}</div>
                                <div class="match-date">${matchInfo.date}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = htmlBuffer;

    } catch (error) {
        console.error("Error connecting to Java Server", error);
    }
}


async function deleteTeam(id) {
    try {
        await deleteFavorite(id);
        loadFavorites();
    } catch (error) {
        alert("Error deleting team.");
    }
}

loadFavorites();