package com.example.sac_training.auth;

public class AuthRequiredException extends RuntimeException {
    public AuthRequiredException() {
        super("認証情報が確認できません。");
    }
}
