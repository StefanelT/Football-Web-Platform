# ⚽ FootballHub

A web platform for football statistics from the Top 5 European Leagues.

## Features

- Live and scheduled matches for Premier League, LaLiga, Serie A, Bundesliga, Ligue 1
- Day navigation (Yesterday / Today / Tomorrow + Calendar)
- Filter matches by league
- Add/remove favourite teams (saved in database)
- Next match display for each favourite team

## Tech Stack

**Frontend**
- HTML, CSS, JavaScript
- External: football-data.org API, Flatpickr

**Backend**
- Java 17, Spring Boot
- REST API (GET, POST, DELETE)
- H2 Database (saved on disk)
- Unit testing with JUnit 5 + Mockito

## How to Run

### Backend
1. Open `FootbalHub - Backend` in IntelliJ
2. Run `FootbalHubBackendApplication.java`

### Frontend
1. Open `FootballHub - Frontend/index.html` in browser
2. Or use Live Server extension in VS Code

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get all favourite teams |
| POST | `/api/favorites` | Add a team to favourites |
| DELETE | `/api/favorites/{id}` | Remove a team from favourites |

## Project Structure

```text
FootballHub/
├── FootballHub - Backend/        #Java Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/footballhub/api/    # Controller, Model, Repository, Service
│   │   │   └── resources/                   # application.properties
│   │   └── test/
│   │       └── java/com/footballhub/api/    # Unit Testing
│   └── pom.xml                   # Maven
│
├── FootballHub - Frontend/       # Web Interface
│   ├── css/                      
│   ├── js/                      
│   ├── index.html                # First Page (Fixtures)
│   └── favorite.html             # Second Page (Favorites)
│
└── .gitignore                   
