package com.smarttraders.backend.ai;

import com.smarttraders.backend.entity.Crop;
import com.smarttraders.backend.repository.CropRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RagContextService {

    private final CropRepository cropRepository;

    public String buildCropContext(String userMessage) {
        List<Crop> allCrops = cropRepository.findAll();

        String lowerMessage = userMessage.toLowerCase();

        List<Crop> relevantCrops = allCrops.stream()
                .filter(crop -> lowerMessage.contains(crop.getCropName().toLowerCase()))
                .toList();

        if (relevantCrops.isEmpty()) {
            return "";
        }

        String contextLines = relevantCrops.stream()
                .map(c -> String.format(
                        "- %s: %.2f %s available at ₹%.2f/%s per unit, listed by %s",
                        c.getCropName(), c.getQuantity(), c.getUnit(),
                        c.getPricePerUnit(), c.getUnit(), c.getFarmer().getFullName()
                ))
                .collect(Collectors.joining("\n"));

        return "Current relevant listings on the platform:\n" + contextLines;
    }
}