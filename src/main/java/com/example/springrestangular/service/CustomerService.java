package com.example.springrestangular.service;

import com.example.springrestangular.model.Customer;
import com.example.springrestangular.repository.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> findAll() {
        return repository.findAll();
    }

    public Customer findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found: " + id));
    }

    @Transactional
    public Customer create(Customer customer) {
        return repository.save(customer);
    }

    @Transactional
    public Customer update(Long id, Customer details) {
        Customer customer = findById(id);
        customer.setFirstName(details.getFirstName());
        customer.setLastName(details.getLastName());
        customer.setEmail(details.getEmail());
        return repository.save(customer);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found: " + id);
        }
        repository.deleteById(id);
    }
}
