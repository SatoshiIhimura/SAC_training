package com.example.sac_training.post;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException() {
        super("対象の投稿が存在しません。");
    }
}
