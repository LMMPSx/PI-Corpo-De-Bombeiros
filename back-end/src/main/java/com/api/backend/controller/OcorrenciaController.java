package com.api.backend.controller;

import com.api.backend.dto.OcorrenciaResponse;
import com.api.backend.dto.OcorrenciaRequest;
import com.api.backend.service.OcorrenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ocorrencias")
@RequiredArgsConstructor
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;

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

    @PostMapping("/createOcorrencia")
    public ResponseEntity<OcorrenciaResponse> create(@RequestBody OcorrenciaRequest ocorrenciaRequest) {
        OcorrenciaResponse ocorrenciaCriada = ocorrenciaService.create(ocorrenciaRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ocorrenciaCriada);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OcorrenciaResponse> update(@PathVariable Integer id, @RequestBody OcorrenciaRequest ocorrenciaRequest) {
        OcorrenciaResponse ocorrenciaAtualizada = ocorrenciaService.update(id, ocorrenciaRequest);
        return ResponseEntity.ok(ocorrenciaAtualizada);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<OcorrenciaResponse> delete(@PathVariable Integer id) {
        ocorrenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
