package com.karan.service.impl;

import com.karan.model.Inventory;
import com.karan.repository.InventoryRepository;
import com.karan.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public Inventory addItem(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Override
    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory updateItem(Long id, Inventory inventory) {

        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setItemName(inventory.getItemName());
        item.setQuantity(inventory.getQuantity());
        item.setPrice(inventory.getPrice());
        item.setSupplier(inventory.getSupplier());

        return inventoryRepository.save(item);
    }

    @Override
    public void deleteItem(Long id) {
        inventoryRepository.deleteById(id);
    }
}