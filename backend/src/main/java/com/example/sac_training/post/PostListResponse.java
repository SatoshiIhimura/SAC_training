package com.example.sac_training.post;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PostListResponse(
        Integer postId,
        String title,
        Importance importance,
        String authorName,
        LocalDate deadline,
        boolean isRead,
        long commentCount,
        LocalDateTime createdAt) {
}
