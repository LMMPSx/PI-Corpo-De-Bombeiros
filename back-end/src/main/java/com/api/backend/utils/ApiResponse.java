package com.api.backend.utils;

import java.util.Hashtable;
import java.util.Map;

public class ApiResponse {
    private String mesage;
    private String code;
    private String status;
    private Map<String, Object> data;

    public static Map<String, Object> success(
            String mesage,
            String code
    ){
        Hashtable<String, Object> result = new Hashtable<>();
        result.put("status", "success");
        result.put("mensagem", mesage);
        result.put("code", code);
        return result;
    }


    public static Map<String, Object> success(
            String mesage,
            String code,
            Object data
    ){
        Hashtable<String, Object> result = new Hashtable<>();
        result.put("status", "success");
        result.put("mensagem", mesage);
        result.put("code", code);
        result.put("data", data);
        return result;
    }


    public static Map<String, Object> error(
            String mesage,
            String code
    ){
        Hashtable<String, Object> result = new Hashtable<>();
        result.put("status", "error");
        result.put("mensagem", mesage);
        result.put("code", code);
        return result;
    }
}
