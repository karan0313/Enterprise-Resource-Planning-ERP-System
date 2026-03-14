package com.karan.service;

import com.karan.model.Finance;
import java.util.List;

public interface FinanceService {

    Finance addRecord(Finance finance);

    List<Finance> getAllRecords();

    Finance updateRecord(Long id, Finance finance);

    void deleteRecord(Long id);
}