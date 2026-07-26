package com.smarttraders.backend.service;

import com.smarttraders.backend.dto.request.ProductRequest;
import com.smarttraders.backend.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request, String traderEmail);
    List<ProductResponse> getMyProducts(String traderEmail);
    List<ProductResponse> getAllProducts();
}