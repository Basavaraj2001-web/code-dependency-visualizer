package com.example.hibernate.model;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String name;
    @Column(nullable=false, unique=true)
    private String email;
    private Integer age;

    public User() {}
    public User(String name, String email, Integer age) {
        this.name = name; this.email = email; this.age = age;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "', age=" + age + "}";
    }
}
