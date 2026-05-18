package com.football.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "teams")

public class Team {
    @Id
    private Long id;
    private String name;
    private String logoUrl;

    public Team(){
    }

    public Team(Long id, String name, String logoUrl)
    {
        this.id = id;
        this.name = name;
        this.logoUrl = logoUrl;
    }

    //Get&Set
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }


    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

}
