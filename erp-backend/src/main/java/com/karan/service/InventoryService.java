package com.karan.service;

import com.karan.model.Inventory;
import java.util.List;

public interface InventoryService {

    Inventory addItem(Inventory inventory);

    List<Inventory> getAllItems();

    Inventory updateItem(Long id, Inventory inventory);

    void deleteItem(Long id);

}