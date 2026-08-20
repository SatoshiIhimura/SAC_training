package com.example.sac_training.post;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface PostListProjection {
    Integer getPostId();
    String getTitle();
    Integer getImportance();
    String getAuthorName();
    LocalDate getDeadline();
    Boolean getRead();
    Long getCommentCount();
    LocalDateTime getCreatedAt();
}
