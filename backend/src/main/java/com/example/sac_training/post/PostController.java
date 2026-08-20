package com.example.sac_training.post;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.sac_training.auth.AuthRequiredException;
import com.example.sac_training.auth.AuthTokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final AuthTokenService authTokenService;

    public PostController(PostService postService, AuthTokenService authTokenService) {
        this.postService = postService;
        this.authTokenService = authTokenService;
    }

    @GetMapping
    public PostPageResponse getPosts(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return PostPageResponse.from(
                postService.getPosts(requireUserId(authorization), keyword, page, size));
    }

    @GetMapping("/{postId}")
    public PostResponse getPost(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Integer postId) {

        return postService.getPost(postId, requireUserId(authorization));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostCreateResponse createPost(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody PostCreateRequest request) {

        return postService.createPost(requireUserId(authorization), request);
    }

    private Integer requireUserId(String authorization) {
        return authTokenService.resolve(authorization)
                .orElseThrow(AuthRequiredException::new);
    }
}
