package com.football.backend.controller;

import com.football.backend.model.Team;
import com.football.backend.repository.TeamRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamRepository teamRepository;

    public TeamController(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @GetMapping
    public List<Team> getAllFavorites() {
        return teamRepository.findAll();
    }

    @PostMapping
    public String addTeamToFavorites(@RequestBody Team team) {
        if (teamRepository.existsById(team.getId())) {
            return "Team " + team.getName() + " is already bookmarked!";
        }
        teamRepository.save(team);
        return "Team " + team.getName() + " was added to Favorites!";
    }

    @DeleteMapping("/{id}")
    public String removeTeamFromFavorites(@PathVariable Long id) {
        if (teamRepository.existsById(id)) {
            teamRepository.deleteById(id);
            return "The team was removed from Favorites!";
        } else {
            return "The team with ID: " + id + " was not found!";
        }
    }
}