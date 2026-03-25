package com.example.hibernate;

import com.example.hibernate.dao.UserDao;
import com.example.hibernate.model.User;
import com.example.hibernate.util.HibernateUtil;

public class AppMain {
    public static void main(String[] args) {
        UserDao dao = new UserDao();
        Long id = dao.saveUser(new User("Alice","a@a.com",25));
        System.out.println("Saved: " + id);
        System.out.println("Fetched: " + dao.getUser(id));
        HibernateUtil.shutdown();
    }
}
