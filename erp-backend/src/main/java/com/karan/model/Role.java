package com.karan.model;

import jakarta.persistence.*;

@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    public Role() {}

    public Role(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // ✅ Getter
    public String getName() {
        return name;
    }

    // ✅ Setter
    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}