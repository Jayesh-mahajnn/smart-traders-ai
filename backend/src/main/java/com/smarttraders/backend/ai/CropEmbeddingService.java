package com.smarttraders.backend.ai;

import com.smarttraders.backend.entity.Crop;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CropEmbeddingService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public void indexCrop(Crop crop) {
        String text = String.format("%s: %s, %.2f %s available at ₹%.2f per %s, sold by %s. %s",
                crop.getCropName(), crop.getCropName(), crop.getQuantity(), crop.getUnit(),
                crop.getPricePerUnit(), crop.getUnit(), crop.getFarmer().getFullName(),
                crop.getDescription() != null ? crop.getDescription() : "");

        TextSegment segment = TextSegment.from(text, dev.langchain4j.data.document.Metadata.from("cropId", String.valueOf(crop.getId())));
        Embedding embedding = embeddingModel.embed(segment).content();
        embeddingStore.add(embedding, segment);
    }

    public List<String> findRelevantCropText(String query, int maxResults) {
        Embedding queryEmbedding = embeddingModel.embed(query).content();

        EmbeddingSearchRequest request = EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .maxResults(maxResults)
                .minScore(0.6)
                .build();

        EmbeddingSearchResult<TextSegment> result = embeddingStore.search(request);

        return result.matches().stream()
                .map(match -> match.embedded().text())
                .toList();
    }
}