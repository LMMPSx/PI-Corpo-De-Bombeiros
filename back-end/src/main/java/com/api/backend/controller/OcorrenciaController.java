package com.api.backend.controller;

import com.api.backend.dto.OcorrenciaResponse;
import com.api.backend.dto.OcorrenciaRequest;
import com.api.backend.service.OcorrenciaService;
import com.fasterxml.jackson.databind.ObjectMapper; // Import necessário
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType; // Import necessário
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import necessário
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/ocorrencias")
@RequiredArgsConstructor
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;
    private final ObjectMapper objectMapper; // Injete para desserializar o JSON

    @GetMapping("/all")
    public ResponseEntity<List<OcorrenciaResponse>> findAll() {
        List<OcorrenciaResponse> ocorrencia = ocorrenciaService.findAll();
        return ResponseEntity.ok(ocorrencia);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OcorrenciaResponse>> findByStatus(@PathVariable String status) {
        List<OcorrenciaResponse> ocorrencias = ocorrenciaService.findByStatus(status);
        return ResponseEntity.ok(ocorrencias);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<OcorrenciaResponse> findById(@PathVariable Integer id) {
        OcorrenciaResponse ocorrencia = ocorrenciaService.findById(id);
        return ResponseEntity.ok(ocorrencia);
    }

    @GetMapping("/prioridade/{prioridade}")
    public ResponseEntity<List<OcorrenciaResponse>> findByPrioridade(@PathVariable String prioridade) {
        List<OcorrenciaResponse> ocorrencias = ocorrenciaService.findByPrioridade(prioridade);
        return ResponseEntity.ok(ocorrencias);
    }

    // 🆕 MÉTODO CREATE - ATUALIZADO PARA RECEBER MULTIPART (JSON + 2 ARQUIVOS)
    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<OcorrenciaResponse> create(
            // Dados JSON da ocorrência
            @RequestPart("ocorrencia") String ocorrenciaJson,
            // Arquivo de Anexo (Opcional)
            @RequestPart(value = "anexo", required = false) MultipartFile anexo,
            // Arquivo de Assinatura (Opcional)
            @RequestPart(value = "assinatura", required = false) MultipartFile assinatura) {

        try {
            System.out.println("JSON OCORRÊNCIA RECEBIDO (CREATE): " + ocorrenciaJson);
            // 1. Converte a String JSON para o DTO
            OcorrenciaRequest ocorrenciaRequest = objectMapper.readValue(ocorrenciaJson, OcorrenciaRequest.class);

            // 2. Chama o serviço com o DTO e os arquivos
            OcorrenciaResponse ocorrenciaCriada = ocorrenciaService.create(ocorrenciaRequest, anexo, assinatura);

            return ResponseEntity.status(HttpStatus.CREATED).body(ocorrenciaCriada);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Erro ao processar requisição de cadastro de ocorrência: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro no formato da requisição ou falha interna.", e);
        }
    }

    // 🆕 MÉTODO UPDATE - ATUALIZADO PARA RECEBER MULTIPART (JSON + 2 ARQUIVOS)
    @PutMapping(value = "/update/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<OcorrenciaResponse> update(
            @PathVariable Integer id,
            // Dados JSON da ocorrência
            @RequestPart("ocorrencia") String ocorrenciaJson,
            // Novo Arquivo de Anexo (Opcional)
            @RequestPart(value = "anexo", required = false) MultipartFile anexo,
            // Novo Arquivo de Assinatura (Opcional)
            @RequestPart(value = "assinatura", required = false) MultipartFile assinatura) {

        try {
            System.out.println("JSON OCORRÊNCIA RECEBIDO (UPDATE): " + ocorrenciaJson);
            // 1. Converte a String JSON para o DTO
            OcorrenciaRequest ocorrenciaRequest = objectMapper.readValue(ocorrenciaJson, OcorrenciaRequest.class);

            // 2. Chama o serviço com o DTO e os arquivos
            OcorrenciaResponse ocorrenciaAtualizada = ocorrenciaService.update(id, ocorrenciaRequest, anexo, assinatura);

            return ResponseEntity.ok(ocorrenciaAtualizada);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Erro ao processar requisição de atualização de ocorrência: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro no formato da requisição ou falha interna.", e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<OcorrenciaResponse> delete(@PathVariable Integer id) {
        ocorrenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
