package com.example.sac_training.common;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ApiErrorResponse(String errorCode, String message, List<FieldErrorResponse> fieldErrors) {

    public ApiErrorResponse(String errorCode, String message) {
        this(errorCode, message, null);
    }
}
