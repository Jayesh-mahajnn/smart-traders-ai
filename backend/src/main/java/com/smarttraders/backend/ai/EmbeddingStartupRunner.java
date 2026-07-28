package com.smarttraders.backend.ai;

import com.smarttraders.backend.repository.CropRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class EmbeddingStartupRunner implements CommandLineRunner {

    private final CropRepository cropRepository;
    private final CropEmbeddingService cropEmbeddingService;

    @Override
    @Transactional(readOnly = true)
    public void run(String... args) {
        cropRepository.findAll().forEach(cropEmbeddingService::indexCrop);
        System.out.println("Re-indexed " + cropRepository.count() + " crops into embedding store on startup.");
    }
}