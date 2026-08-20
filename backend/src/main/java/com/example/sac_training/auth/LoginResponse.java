package com.example.sac_training.auth;

public record LoginResponse(Integer userId, String userName, String accessToken, String message) {}
