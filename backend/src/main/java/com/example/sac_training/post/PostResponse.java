package com.example.sac_training.post;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PostResponse(
        Integer postId,
        String title,
        String body,
        Importance importance,
        Integer authorUserId,
        String authorName,
        LocalDate deadline,
        LocalDateTime createdAt,
        boolean canDelete) {
}
