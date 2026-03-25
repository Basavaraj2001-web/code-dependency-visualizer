package com.springboot.web.service;


import com.springboot.web.repository.UserRepository;

public class UserService {

    private UserRepository userRepository = new UserRepository();

    public void saveUser() {
        System.out.println("Service calling Repository");
        userRepository.save();
    }
}
