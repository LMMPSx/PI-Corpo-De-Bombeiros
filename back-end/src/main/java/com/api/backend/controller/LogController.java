package com.api.backend.controller;

import com.api.backend.dto.LogResponse;
import com.api.backend.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/log")
@RequiredArgsConstructor
public class    LogController {

    private final LogService logService;

    @GetMapping("/all")
    public ResponseEntity<List<LogResponse>> findAll() {
        return ResponseEntity.ok(logService.findAll());
    }

    @GetMapping("/entidade/{entidade}")
    public ResponseEntity<List<LogResponse>> findByEntidade(@PathVariable String entidade) {
        return ResponseEntity.ok(logService.findByEntidade(entidade));
    }

    @GetMapping("/usuario/id/{id}")
    public ResponseEntity<List<LogResponse>> findByIdUsuario(@PathVariable Integer id) {
        return ResponseEntity.ok(logService.findByUsuario_Id_Usuario(id));
    }

    @GetMapping("/usuario/nome/{usuario}")
    public ResponseEntity<List<LogResponse>> findByIdUsuario_NomeUsuario(@PathVariable String usuario) {
        return ResponseEntity.ok(logService.findByUsuario_NomeUsuario(usuario));
    }
}
