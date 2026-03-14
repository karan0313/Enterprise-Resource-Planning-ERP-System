package com.karan.service.impl;

import com.karan.model.Sale;
import com.karan.repository.SaleRepository;
import com.karan.service.SaleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleServiceImpl implements SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Override
    public Sale createSale(Sale sale) {

        double total = sale.getPrice() * sale.getQuantity();
        sale.setTotalAmount(total);

        return saleRepository.save(sale);
    }

    @Override
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @Override
    public Sale updateSale(Long id, Sale sale) {

        Sale existingSale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        existingSale.setProductName(sale.getProductName());
        existingSale.setPrice(sale.getPrice());
        existingSale.setQuantity(sale.getQuantity());

        double total = sale.getPrice() * sale.getQuantity();
        existingSale.setTotalAmount(total);

        existingSale.setSaleDate(sale.getSaleDate());

        return saleRepository.save(existingSale);
    }

    @Override
    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }
}