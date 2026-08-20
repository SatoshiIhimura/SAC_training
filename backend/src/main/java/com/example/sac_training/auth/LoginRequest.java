package com.example.sac_training.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "ユーザー名を入力してください。") String userName,
        @NotBlank(message = "パスワードを入力してください。") String password) {}
