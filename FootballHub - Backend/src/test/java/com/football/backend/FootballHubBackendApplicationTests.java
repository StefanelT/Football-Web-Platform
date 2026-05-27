package com.football.backend;

import com.football.backend.model.Team;
import com.football.backend.repository.TeamRepository;
import com.football.backend.controller.TeamController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FootballHubBackendApplicationTests {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamController teamController;

    @BeforeEach
    void cleanup() {
        teamRepository.deleteAll();
    }

    @Test
    void addTeam_ShouldSaveInDatabase() {
        Team team = new Team(66L, "Liverpool", "https://logo.url");
        teamController.addTeamToFavorites(team);
        assertTrue(teamRepository.existsById(66L));
    }

    @Test
    void addTeam_WhenAlreadyExists_ShouldNotDuplicate() {
        Team team = new Team(66L, "Liverpool", "https://logo.url");
        teamRepository.save(team);
        teamController.addTeamToFavorites(team);
        assertEquals(1, teamRepository.findAll().size());
    }

    @Test
    void removeTeam_ShouldDeleteFromDatabase() {
        teamRepository.save(new Team(66L, "Liverpool", "https://logo.url"));
        teamController.removeTeamFromFavorites(66L);
        assertFalse(teamRepository.existsById(66L));
    }

    @Test
    void getAll_ShouldReturnSavedTeams() {
        teamRepository.save(new Team(66L, "Liverpool", "https://logo.url"));
        teamRepository.save(new Team(57L, "Arsenal", "https://logo.url"));
        var teams = teamController.getAllFavorites();
        assertEquals(2, teams.size());
    }
}