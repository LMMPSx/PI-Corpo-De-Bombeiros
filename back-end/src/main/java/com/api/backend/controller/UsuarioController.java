package com.api.backend.controller;

import com.api.backend.dto.UsuarioResponse;
import com.api.backend.dto.UsuarioRequest;
import com.api.backend.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper; // 👈 Adicionado para parsear o JSON
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType; // 👈 Adicionado para tipo de mídia
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // 👈 Adicionado para o arquivo
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ObjectMapper objectMapper; // 👈 Injetado para desserializar o JSON

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

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<UsuarioResponse> findByCpf(@PathVariable String cpf) {
        UsuarioResponse usuario = usuarioService.findByCpf(cpf);
        return ResponseEntity.ok(usuario);
    }

    // 🚨 MÉTODO CREATE ATUALIZADO PARA RECEBER MULTIPART (JSON + ARQUIVO) 🚨
    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<UsuarioResponse> create(
            // Recebe os dados do usuário como uma String JSON
            @RequestPart("usuario") String usuarioJson,
            // Recebe o arquivo da foto, é opcional (required = false)
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        try {
            System.out.println("JSON USUÁRIO RECEBIDO (BACKEND): " + usuarioJson);
            // 1. Converte a String JSON (usuarioJson) de volta para o DTO UsuarioRequest
            UsuarioRequest usuarioRequest = objectMapper.readValue(usuarioJson, UsuarioRequest.class);

            // 2. Chama o serviço, passando o DTO e o arquivo
            UsuarioResponse novoUsuario = usuarioService.create(usuarioRequest, foto);

            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);

        } catch (ResponseStatusException e) {
            // Captura as exceções de status (CONFILCT, NOT_FOUND) lançadas pelo Service
            throw e;
        } catch (Exception e) {
            // Captura erros de I/O ou de parsing do JSON
            System.err.println("Erro ao processar requisição de cadastro: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro no formato da requisição ou falha interna.", e);
        }
    }

    @PatchMapping(value = "/update/{cpf}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<UsuarioResponse> update(
            @PathVariable String cpf,
            // O nome "usuario" deve coincidir com a chave usada no FormData do frontend
            @RequestPart("usuario") String usuarioJson,
            // A foto é opcional para a atualização
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        try {
            System.out.println("JSON USUÁRIO RECEBIDO (UPDATE): " + usuarioJson);
            // 1. Converte a String JSON para o DTO de requisição
            UsuarioRequest usuarioRequest = objectMapper.readValue(usuarioJson, UsuarioRequest.class);

            // 2. Chama o serviço para aplicar a atualização
            UsuarioResponse usuarioAtualizado = usuarioService.update(cpf, usuarioRequest, foto);

            return ResponseEntity.ok(usuarioAtualizado);

        } catch (ResponseStatusException e) {
            // Captura as exceções de status (NOT_FOUND, CONFLICT) lançadas pelo Service
            throw e;
        } catch (Exception e) {
            // Captura erros de I/O ou de parsing do JSON
            System.err.println("Erro ao processar requisição de atualização: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro no formato da requisição ou falha interna.", e);
        }
    }

    @DeleteMapping("/delete/{cpf}")
    public ResponseEntity<UsuarioResponse> delete(@PathVariable String cpf) {
        usuarioService.delete(cpf);
        return ResponseEntity.noContent().build();
    }
}