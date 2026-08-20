package com.example.sac_training.authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.sac_training.user.User;
import com.example.sac_training.user.UserRepository;

@Service
public class AuthenticationService {

    private static final String LOGIN_FAILED_MESSAGE = "ユーザー名またはパスワードが正しくありません。";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUserName(request.userName().trim())
                .orElseThrow(() -> new AuthenticationException(LOGIN_FAILED_MESSAGE));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new AuthenticationException(LOGIN_FAILED_MESSAGE);
        }

        return new LoginResponse(user.getUserId(), user.getUserName());
    }
}
