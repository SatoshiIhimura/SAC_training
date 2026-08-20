package com.example.sac_training.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.sac_training.user.User;
import com.example.sac_training.user.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService tokens;

    public AuthenticationController(UserRepository users, PasswordEncoder passwordEncoder, AuthTokenService tokens) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.tokens = tokens;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        User user = users.findByUserName(request.userName())
                .filter(value -> passwordEncoder.matches(request.password(), value.getPassword()))
                .orElseThrow(AuthenticationFailedException::new);
        return new LoginResponse(user.getUserId(), user.getUserName(), tokens.issue(user.getUserId()), "ログインしました。");
    }

    @GetMapping("/me")
    public LoginResponse me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        User user = authenticatedUser(authorization);
        return new LoginResponse(user.getUserId(), user.getUserName(), null, null);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        authenticatedUser(authorization);
        tokens.revoke(authorization);
    }

    private User authenticatedUser(String authorization) {
        Integer userId = tokens.resolve(authorization)
                .orElseThrow(AuthRequiredException::new);
        return users.findById(userId)
                .orElseThrow(AuthRequiredException::new);
    }
}
