const API_KEY = '19fb55be8a374c63b3f9e6a5f817e81a';
const FOOTBALL_BASE_URL = 'https://corsproxy.io/?https://api.football-data.org/v4';
const JAVA_API_URL = 'http://localhost:8080/api/favorites';

async function fetchMatches(dateFrom, dateTo) {
    return await fetch(
        `${FOOTBALL_BASE_URL}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { method: 'GET', headers: { 'X-Auth-Token': API_KEY } }
    );
}

async function fetchNextMatch(teamId) {
    return await fetch(
        `${FOOTBALL_BASE_URL}/teams/${teamId}/matches?status=SCHEDULED`,
        { method: 'GET', headers: { 'X-Auth-Token': API_KEY } }
    );
}


async function fetchFavorites() {
    return await fetch(JAVA_API_URL);
}

async function addFavorite(teamData) {
    return await fetch(JAVA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData)
    });
}

async function deleteFavorite(teamId) {
    await fetch(`${JAVA_API_URL}/${teamId}`, { method: 'DELETE' });
}
