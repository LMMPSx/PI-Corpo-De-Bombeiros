package com.api.backend.utils;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    @Getter
    final String message;

    @Getter
    final String code;

    @Getter
    final HttpStatus httpStatus;

    public ApiException(String message, String code, HttpStatus httpStatus){
        this.message = message;
        this.code =  code;
        this.httpStatus = httpStatus;
    }
}
