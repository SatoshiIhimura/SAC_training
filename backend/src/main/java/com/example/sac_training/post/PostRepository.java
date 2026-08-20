package com.example.sac_training.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @Query(value = """
            SELECT
                p.post_id AS "postId",
                p.title AS "title",
                p.importance AS "importance",
                u.user_name AS "authorName",
                p.deadline AS "deadline",
                EXISTS (
                    SELECT 1 FROM post_reads pr
                    WHERE pr.post_id = p.post_id AND pr.user_id = :userId
                ) AS "read",
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS "commentCount",
                p.created_at AS "createdAt"
            FROM posts p
            JOIN users u ON u.user_id = p.user_id
            WHERE (p.deadline IS NULL OR p.deadline >= CURRENT_DATE)
              AND (
                  :keyword = ''
                  OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(p.body) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            ORDER BY p.created_at DESC
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM posts p
            WHERE (p.deadline IS NULL OR p.deadline >= CURRENT_DATE)
              AND (
                  :keyword = ''
                  OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(p.body) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            """,
            nativeQuery = true)
    Page<PostListProjection> searchPosts(
            @Param("userId") Integer userId,
            @Param("keyword") String keyword,
            Pageable pageable);
}
