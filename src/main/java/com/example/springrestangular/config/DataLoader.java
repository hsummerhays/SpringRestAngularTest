package com.example.springrestangular.config;

import com.example.springrestangular.model.Customer;
import com.example.springrestangular.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(CustomerRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Customer("Alice", "Smith", "alice.smith@example.com"));
                repository.save(new Customer("Bob", "Johnson", "bob.johnson@example.com"));
                repository.save(new Customer("Charlie", "Brown", "charlie.brown@example.com"));
                repository.save(new Customer("Diana", "Prince", "diana.prince@example.com"));
            }
        };
    }
}
