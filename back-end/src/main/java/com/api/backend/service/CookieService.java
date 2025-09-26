package com.api.backend.service;

import com.api.backend.model.UsuarioModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CookieService {

    private void cookieToken(String token, HttpServletResponse response) {
        Cookie cookie = new Cookie("Token: ", token);

        cookie.setHttpOnly(true);
        cookie.setMaxAge(1000 * 60 * 60 * 10);
        cookie.setSecure(false);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    public void cookieUser(UsuarioModel usuarioModel, HttpServletResponse response) {
        try {
            Map<String, Object> data  = new HashMap<>();
            data.put("idUsuario", usuarioModel.getIdUsuario());
            data.put("nomeUsuario", usuarioModel.getNomeUsuario());
            data.put("tipoUsuario", usuarioModel.getTipoUsuario());

            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(data);
            String encoded = URLEncoder.encode(json, StandardCharsets.UTF_8);

            Cookie cookie = new Cookie("userData", encoded);
            cookie.setHttpOnly(true);
            cookie.setMaxAge(1000 * 60 * 60 * 10);
            cookie.setSecure(false);
            cookie.setPath("/");

            response.addCookie(cookie);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    public void removeCookie(String name, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .sameSite("Lax")
                .maxAge(0)
                .httpOnly("token".equals(name))
                .path("/")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    public String getTokenFromRequest(HttpServletRequest request) {
        if(request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
