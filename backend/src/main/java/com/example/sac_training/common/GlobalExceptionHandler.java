package com.example.sac_training.common;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        List<FieldErrorResponse> fieldErrors = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldErrorResponse(
                        error.getField(),
                        error.getDefaultMessage()))
                .toList();

        return ResponseEntity.badRequest().body(
                new ApiErrorResponse("VALIDATION_ERROR", "入力内容に誤りがあります。", fieldErrors));
    }

    @ExceptionHandler(RequestValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleRequestValidation(RequestValidationException exception) {
        return ResponseEntity.badRequest().body(
                new ApiErrorResponse(
                        "VALIDATION_ERROR",
                        "入力内容に誤りがあります。",
                        List.of(new FieldErrorResponse(exception.getField(), exception.getMessage()))));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(ConflictException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiErrorResponse(exception.getErrorCode(), exception.getMessage()));
    }

}
