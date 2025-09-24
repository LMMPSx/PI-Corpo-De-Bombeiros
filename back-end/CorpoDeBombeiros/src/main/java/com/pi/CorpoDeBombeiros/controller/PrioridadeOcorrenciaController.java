package com.pi.CorpoDeBombeiros.controller;

import com.pi.CorpoDeBombeiros.dto.PrioridadeOcorrenciaDTO;
import com.pi.CorpoDeBombeiros.service.PrioridadeOcorrenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("prioriadade-ocorrencia")
@RequiredArgsConstructor
public class PrioridadeOcorrenciaController {

    private final PrioridadeOcorrenciaService prioridadeOcorrenciaService;

    @GetMapping
    public ResponseEntity<List<PrioridadeOcorrenciaDTO>> findAll() {
        return ResponseEntity.ok(prioridadeOcorrenciaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrioridadeOcorrenciaDTO> findById(@PathVariable Integer id) {
        PrioridadeOcorrenciaDTO prioridadeOcorrencia = prioridadeOcorrenciaService.findById(id);
        return ResponseEntity.ok(prioridadeOcorrencia);
    }
}
