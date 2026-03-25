package com.springboot.web.controller;




import com.springboot.web.service.UserService;

public class UserController {

    private UserService userService = new UserService();

    public void createUser() {
        System.out.println("Controller calling Service");
        userService.saveUser();
    }
}
