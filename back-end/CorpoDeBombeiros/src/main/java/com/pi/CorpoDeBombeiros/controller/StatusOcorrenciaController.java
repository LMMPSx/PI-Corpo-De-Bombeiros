package com.pi.CorpoDeBombeiros.controller;

import com.pi.CorpoDeBombeiros.dto.StatusOcorrenciaDTO;
import com.pi.CorpoDeBombeiros.service.StatusOcorrenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/status-ocorrencia")
@RequiredArgsConstructor
public class StatusOcorrenciaController {

    private final StatusOcorrenciaService statusOcorrenciaService;

    @GetMapping("/all")
    public ResponseEntity<List<StatusOcorrenciaDTO>> findAll() {
        return ResponseEntity.ok(statusOcorrenciaService.findAll());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<StatusOcorrenciaDTO> findById(@PathVariable Integer id) {
        StatusOcorrenciaDTO statusOcorrencia =  statusOcorrenciaService.findById(id);
        return ResponseEntity.ok(statusOcorrencia);
    }
}
