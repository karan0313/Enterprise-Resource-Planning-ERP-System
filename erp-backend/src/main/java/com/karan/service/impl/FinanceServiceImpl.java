package com.karan.service.impl;

import com.karan.model.Finance;
import com.karan.repository.FinanceRepository;
import com.karan.service.FinanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinanceServiceImpl implements FinanceService {

    @Autowired
    private FinanceRepository financeRepository;

    @Override
    public Finance addRecord(Finance finance) {
        return financeRepository.save(finance);
    }

    @Override
    public List<Finance> getAllRecords() {
        return financeRepository.findAll();
    }

    @Override
    public Finance updateRecord(Long id, Finance finance) {

        Finance record = financeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        record.setType(finance.getType());
        record.setAmount(finance.getAmount());
        record.setDescription(finance.getDescription());
        record.setDate(finance.getDate());

        return financeRepository.save(record);
    }

    @Override
    public void deleteRecord(Long id) {
        financeRepository.deleteById(id);
    }
}