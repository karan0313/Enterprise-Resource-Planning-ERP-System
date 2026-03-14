package com.karan.service;

import com.karan.model.Sale;
import java.util.List;

public interface SaleService {

    Sale createSale(Sale sale);

    List<Sale> getAllSales();

    Sale updateSale(Long id, Sale sale);

    void deleteSale(Long id);
}