package com.example.sac_training.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.sac_training.common.ConflictException;
import com.example.sac_training.common.RequestValidationException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(UserRegistrationRequest request) {
        if (!request.password().equals(request.passwordConfirm())) {
            throw new RequestValidationException("passwordConfirm", "パスワードが一致しません。");
        }

        if (userRepository.existsByUserName(request.userName())) {
            throw new ConflictException("USERNAME_DUPLICATE", "このユーザー名は既に使用されています。");
        }

        String hashedPassword = passwordEncoder.encode(request.password());
        userRepository.save(new User(request.userName(), hashedPassword, request.age()));
    }

}
