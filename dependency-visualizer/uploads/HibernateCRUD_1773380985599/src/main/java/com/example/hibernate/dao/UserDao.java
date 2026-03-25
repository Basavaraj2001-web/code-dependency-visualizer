package com.example.hibernate.dao;

import com.example.hibernate.model.User;
import com.example.hibernate.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import java.util.List;

public class UserDao {

    public Long saveUser(User user) {
        Transaction tx = null;
        Long id = null;
        try (Session s = HibernateUtil.getSessionFactory().openSession()) {
            tx = s.beginTransaction();
            id = (Long) s.save(user);
            tx.commit();
        } catch (Exception e) { if (tx != null) tx.rollback(); }
        return id;
    }

    public User getUser(Long id) {
        try (Session s = HibernateUtil.getSessionFactory().openSession()) {
            return s.get(User.class, id);
        }
    }

    public List<User> getAllUsers() {
        try (Session s = HibernateUtil.getSessionFactory().openSession()) {
            return s.createQuery("from User").list();
        }
    }

    public void updateUser(User user) {
        Transaction tx = null;
        try (Session s = HibernateUtil.getSessionFactory().openSession()) {
            tx = s.beginTransaction();
            s.update(user);
            tx.commit();
        } catch (Exception e) { if (tx != null) tx.rollback(); }
    }

    public void deleteUser(Long id) {
        Transaction tx = null;
        try (Session s = HibernateUtil.getSessionFactory().openSession()) {
            tx = s.beginTransaction();
            User u = s.get(User.class, id);
            if (u != null) s.delete(u);
            tx.commit();
        } catch (Exception e) { if (tx != null) tx.rollback(); }
    }
}
