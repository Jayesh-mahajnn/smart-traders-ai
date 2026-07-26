package com.smarttraders.backend.service.impl;

import com.smarttraders.backend.dto.request.ProductRequest;
import com.smarttraders.backend.dto.response.ProductResponse;
import com.smarttraders.backend.entity.Product;
import com.smarttraders.backend.entity.User;
import com.smarttraders.backend.exception.ResourceNotFoundException;
import com.smarttraders.backend.repository.ProductRepository;
import com.smarttraders.backend.repository.UserRepository;
import com.smarttraders.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request, String traderEmail) {
        User trader = userRepository.findByEmail(traderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + traderEmail));

        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setQuantityNeeded(request.getQuantityNeeded());
        product.setUnit(request.getUnit());
        product.setMaxPricePerUnit(request.getMaxPricePerUnit());
        product.setDescription(request.getDescription());
        product.setTrader(trader);

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Override
    public List<ProductResponse> getMyProducts(String traderEmail) {
        User trader = userRepository.findByEmail(traderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + traderEmail));
        return productRepository.findByTraderId(trader.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getProductName(),
                product.getQuantityNeeded(),
                product.getUnit(),
                product.getMaxPricePerUnit(),
                product.getDescription(),
                product.getTrader().getFullName(),
                product.getCreatedAt()
        );
    }
}