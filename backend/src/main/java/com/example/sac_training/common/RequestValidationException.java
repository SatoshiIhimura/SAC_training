package com.example.sac_training.common;

public class RequestValidationException extends RuntimeException {

    private final String field;

    public RequestValidationException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
