package com.pi.CorpoDeBombeiros.controller;

import com.pi.CorpoDeBombeiros.dto.UsuarioDTO;
import com.pi.CorpoDeBombeiros.dto.UsuarioRequestDTO;
import com.pi.CorpoDeBombeiros.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping("/all")
    public ResponseEntity<List<UsuarioDTO>> findAll() {
        List<UsuarioDTO> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UsuarioDTO> findById(@PathVariable Integer id) {
        UsuarioDTO usuario = usuarioService.findById(id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("createUsuario/")
    public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioRequestDTO usuarioRequest) {
        UsuarioDTO usuarioCriado = usuarioService.create(usuarioRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriado);
    }

    @PutMapping("/upadete/{id}")
    public ResponseEntity<UsuarioDTO> update(@PathVariable Integer id, @RequestBody UsuarioRequestDTO usuarioRequest) {
        UsuarioDTO usuarioAtualizado = usuarioService.update(id, usuarioRequest);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<UsuarioDTO> delete(@PathVariable Integer id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
