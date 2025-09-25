package com.api.backend.controller;

import com.api.backend.dto.OcorrenciaDTO;
import com.api.backend.dto.OcorrenciaRequestDTO;
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
    public ResponseEntity<List<OcorrenciaDTO>> findAll() {
        List<OcorrenciaDTO> ocorrencia = ocorrenciaService.findAll();
        return ResponseEntity.ok(ocorrencia);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OcorrenciaDTO>> findByStatus(@PathVariable String status) {
        List<OcorrenciaDTO> ocorrencias = ocorrenciaService.findByStatus(status);
        return ResponseEntity.ok(ocorrencias);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<OcorrenciaDTO> findById(@PathVariable Integer id) {
        OcorrenciaDTO ocorrencia = ocorrenciaService.findById(id);
        return ResponseEntity.ok(ocorrencia);
    }

    @GetMapping("/prioridade/{prioridade}")
    public ResponseEntity<List<OcorrenciaDTO>> findByPrioridade(@PathVariable String prioridade) {
        List<OcorrenciaDTO> ocorrencias = ocorrenciaService.findByPrioridade(prioridade);
        return ResponseEntity.ok(ocorrencias);
    }

    @PostMapping("/createOcorrencia")
    public ResponseEntity<OcorrenciaDTO> create(@RequestBody OcorrenciaRequestDTO ocorrenciaRequest) {
        OcorrenciaDTO ocorrenciaCriada = ocorrenciaService.create(ocorrenciaRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ocorrenciaCriada);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OcorrenciaDTO> update(@PathVariable Integer id, @RequestBody OcorrenciaRequestDTO ocorrenciaRequest) {
        OcorrenciaDTO ocorrenciaAtualizada = ocorrenciaService.update(id, ocorrenciaRequest);
        return ResponseEntity.ok(ocorrenciaAtualizada);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<OcorrenciaDTO> delete(@PathVariable Integer id) {
        ocorrenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
