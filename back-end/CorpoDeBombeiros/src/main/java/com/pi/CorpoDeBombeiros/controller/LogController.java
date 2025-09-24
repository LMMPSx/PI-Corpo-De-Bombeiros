package com.pi.CorpoDeBombeiros.controller;

import com.pi.CorpoDeBombeiros.dto.LogDTO;
import com.pi.CorpoDeBombeiros.service.LogService;
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
public class LogController {

    private final LogService logService;

    @GetMapping
    public ResponseEntity<List<LogDTO>> findAll() {
        return ResponseEntity.ok(logService.findAll());
    }

    @GetMapping("/entidade/{entidade}")
    public ResponseEntity<List<LogDTO>> findByEntidade(@PathVariable String entidade) {
        return ResponseEntity.ok(logService.findByEntidade(entidade));
    }

    @GetMapping("/usuario/{usuario}")
    public ResponseEntity<List<LogDTO>> findByUsuario(@PathVariable String usuario) {
        return ResponseEntity.ok(logService.findByUsuario(usuario));
    }
}
