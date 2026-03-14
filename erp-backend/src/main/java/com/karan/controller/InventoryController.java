package com.karan.controller;

import com.karan.model.Inventory;
import com.karan.service.InventoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public Inventory addItem(@RequestBody Inventory inventory) {
        return inventoryService.addItem(inventory);
    }

    @GetMapping
    public List<Inventory> getAllItems() {
        return inventoryService.getAllItems();
    }

    @PutMapping("/{id}")
    public Inventory updateItem(@PathVariable Long id,
                                @RequestBody Inventory inventory) {
        return inventoryService.updateItem(id, inventory);
    }

    @DeleteMapping("/{id}")
    public String deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return "Item deleted successfully";
    }
}