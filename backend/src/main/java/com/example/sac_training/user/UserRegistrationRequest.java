package com.example.sac_training.user;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegistrationRequest(
        @NotBlank(message = "ユーザー名を入力してください。")
        @Size(min = 4, max = 50, message = "ユーザー名は4文字以上50文字以内で入力してください。")
        @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "ユーザー名は半角英数字・ハイフン・アンダースコアのみで入力してください。")
        String userName,

        @NotBlank(message = "パスワードを入力してください。")
        @Size(min = 8, max = 50, message = "パスワードは8文字以上50文字以内で入力してください。")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$", message = "パスワードは半角英字と数字を組み合わせて入力してください。")
        String password,

        @NotBlank(message = "確認用パスワードを入力してください。")
        String passwordConfirm,

        @NotNull(message = "年齢を入力してください。")
        @Min(value = 0, message = "年齢は0歳以上119歳以下で入力してください。")
        @Max(value = 119, message = "年齢は0歳以上119歳以下で入力してください。")
        Integer age) {
}
