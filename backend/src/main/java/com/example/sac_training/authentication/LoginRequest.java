package com.example.sac_training.authentication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "ユーザー名を入力してください。")
        @Size(max = 50, message = "ユーザー名は50文字以内で入力してください。")
        String userName,

        @NotBlank(message = "パスワードを入力してください。")
        @Size(max = 50, message = "パスワードは50文字以内で入力してください。")
        String password) {
}
