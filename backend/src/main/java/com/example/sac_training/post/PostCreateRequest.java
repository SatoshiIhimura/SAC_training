package com.example.sac_training.post;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;

public record PostCreateRequest(
        String title,

        String body,

        String importance,

        @FutureOrPresent(message = "本日以降の日付を入力してください")
        LocalDate deadline) {
}
