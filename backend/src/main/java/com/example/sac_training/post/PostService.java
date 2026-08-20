package com.example.sac_training.post;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.sac_training.auth.AuthRequiredException;
import com.example.sac_training.common.RequestValidationException;
import com.example.sac_training.user.User;
import com.example.sac_training.user.UserRepository;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<PostListResponse> getPosts(Integer userId, String keyword, int page, int size) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        validateSearch(normalizedKeyword, page, size);

        PageRequest pageable = PageRequest.of(page, size);

        return postRepository.searchPosts(userId, normalizedKeyword, pageable)
                .map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Integer postId, Integer loginUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(PostNotFoundException::new);
        return toDetailResponse(post, loginUserId);
    }

    @Transactional
    public PostCreateResponse createPost(Integer userId, PostCreateRequest request) {
        ValidatedPostInput input = validatePostRequest(request);
        User author = userRepository.findById(userId)
                .orElseThrow(AuthRequiredException::new);

        Post post = new Post(
                author,
                input.title(),
                input.body(),
                input.importance().value(),
                request.deadline());

        Post savedPost = postRepository.save(post);
        return new PostCreateResponse(savedPost.getPostId(), "投稿を登録しました。");
    }

    private void validateSearch(String keyword, int page, int size) {
        if (keyword.length() > 100) {
            throw new RequestValidationException("keyword", "キーワードを100文字以内で入力してください");
        }
        if (page < 0) {
            throw new RequestValidationException("page", "ページ番号は0以上で指定してください。");
        }
        if (size < 1 || size > 100) {
            throw new RequestValidationException("size", "表示件数は1以上100以下で指定してください。");
        }
    }

    private ValidatedPostInput validatePostRequest(PostCreateRequest request) {
        if (request.title() == null || request.title().isEmpty()) {
            throw new RequestValidationException("title", "タイトルを入力してください。");
        }
        if (request.title().trim().isEmpty()) {
            throw new RequestValidationException("title", "タイトルに空白のみは入力できません。");
        }
        if (request.title().trim().length() > 100) {
            throw new RequestValidationException("title", "タイトルを100文字以内で入力してください");
        }
        if (request.body() == null || request.body().isEmpty()) {
            throw new RequestValidationException("body", "本文を入力してください。");
        }
        if (request.body().trim().isEmpty()) {
            throw new RequestValidationException("body", "本文に空白のみは入力できません。");
        }
        if (request.body().trim().length() > 2000) {
            throw new RequestValidationException("body", "本文を2000文字以内で入力してください");
        }

        Importance importance = Importance.fromRequestValue(request.importance());
        if (importance == null) {
            throw new RequestValidationException("importance", "重要度を選択してください");
        }
        if (request.deadline() != null && request.deadline().isBefore(LocalDate.now())) {
            throw new RequestValidationException("deadline", "本日以降の日付を入力してください");
        }

        return new ValidatedPostInput(request.title().trim(), request.body().trim(), importance);
    }

    private PostListResponse toListResponse(PostListProjection post) {
        return new PostListResponse(
                post.getPostId(),
                post.getTitle(),
                Importance.fromValue(post.getImportance()),
                post.getAuthorName(),
                post.getDeadline(),
                Boolean.TRUE.equals(post.getRead()),
                post.getCommentCount() == null ? 0 : post.getCommentCount(),
                post.getCreatedAt());
    }

    private PostResponse toDetailResponse(Post post, Integer loginUserId) {
        return new PostResponse(
                post.getPostId(),
                post.getTitle(),
                post.getBody(),
                Importance.fromValue(post.getImportance()),
                post.getAuthor().getUserId(),
                post.getAuthor().getUserName(),
                post.getDeadline(),
                post.getCreatedAt(),
                post.getAuthor().getUserId().equals(loginUserId));
    }

    private record ValidatedPostInput(String title, String body, Importance importance) {
    }
}
