package com.pi.CorpoDeBombeiros.controller;

import com.pi.CorpoDeBombeiros.dto.OcorrenciaDTO;
import com.pi.CorpoDeBombeiros.dto.OcorrenciaRequestDTO;
import com.pi.CorpoDeBombeiros.service.OcorrenciaService;
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

    @GetMapping
    public ResponseEntity<List<OcorrenciaDTO>> findAll() {
        List<OcorrenciaDTO> ocorrencia = ocorrenciaService.findAll();
        return ResponseEntity.ok(ocorrencia);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OcorrenciaDTO>> findByStatus(@PathVariable String status) {
        List<OcorrenciaDTO> ocorrencias = ocorrenciaService.findByStatus(status);
        return ResponseEntity.ok(ocorrencias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcorrenciaDTO> findById(@PathVariable Integer id) {
        OcorrenciaDTO ocorrencia = ocorrenciaService.findById(id);
        return ResponseEntity.ok(ocorrencia);
    }

    @PostMapping
    public ResponseEntity<OcorrenciaDTO> create(@RequestBody OcorrenciaRequestDTO ocorrenciaRequest) {
        OcorrenciaDTO ocorrenciaCriada = ocorrenciaService.create(ocorrenciaRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ocorrenciaCriada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OcorrenciaDTO> update(@PathVariable Integer id, @RequestBody OcorrenciaRequestDTO ocorrenciaRequest) {
        OcorrenciaDTO ocorrenciaAtualizada = ocorrenciaService.update(id, ocorrenciaRequest);
        return ResponseEntity.ok(ocorrenciaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OcorrenciaDTO> delete(@PathVariable Integer id) {
        ocorrenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
