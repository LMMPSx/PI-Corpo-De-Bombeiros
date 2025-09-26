package com.api.backend.controller;

import com.api.backend.dto.UsuarioResponse;
import com.api.backend.dto.UsuarioRequest;
import com.api.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping("/all")
    public ResponseEntity<List<UsuarioResponse>> findAll() {
        List<UsuarioResponse> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UsuarioResponse> findById(@PathVariable Integer id) {
        UsuarioResponse usuario = usuarioService.findById(id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("createUsuario/")
    public ResponseEntity<UsuarioResponse> create(@RequestBody UsuarioRequest usuarioRequest) {
        UsuarioResponse usuarioCriado = usuarioService.create(usuarioRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriado);
    }

    @PutMapping("/upadete/{id}")
    public ResponseEntity<UsuarioResponse> update(@PathVariable Integer id, @RequestBody UsuarioRequest usuarioRequest) {
        UsuarioResponse usuarioAtualizado = usuarioService.update(id, usuarioRequest);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<UsuarioResponse> delete(@PathVariable Integer id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
