package com.springboot.web.repository;




import com.springboot.web.service.UserService;

public class UserRepository {

    public void save() {
        System.out.println("Saving user to database");
    }

    public void callService() {
        UserService service = new UserService();
    }
}
