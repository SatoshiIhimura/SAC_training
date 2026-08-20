package com.example.sac_training.auth;

public class AuthenticationFailedException extends RuntimeException {
    public AuthenticationFailedException() {
        super("入力内容に誤りがあります。");
    }
}
