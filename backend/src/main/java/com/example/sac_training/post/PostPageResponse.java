package com.example.sac_training.post;

import java.util.List;

import org.springframework.data.domain.Page;

public record PostPageResponse(
        List<PostListResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages) {

    public static PostPageResponse from(Page<PostListResponse> result) {
        return new PostPageResponse(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages());
    }
}
