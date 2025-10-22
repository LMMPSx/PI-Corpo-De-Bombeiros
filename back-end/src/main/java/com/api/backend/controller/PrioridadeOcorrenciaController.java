//package com.api.backend.controller;
//
//import com.api.backend.dto.PrioridadeOcorrenciaResponse;
//import com.api.backend.service.PrioridadeOcorrenciaService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("prioriadade-ocorrencia")
//@RequiredArgsConstructor
//public class PrioridadeOcorrenciaController {
//
//    private final PrioridadeOcorrenciaService prioridadeOcorrenciaService;
//
//    @GetMapping("/all")
//    public ResponseEntity<List<PrioridadeOcorrenciaResponse>> findAll() {
//        return ResponseEntity.ok(prioridadeOcorrenciaService.findAll());
//    }
//
//    @GetMapping("/id/{id}")
//    public ResponseEntity<PrioridadeOcorrenciaResponse> findById(@PathVariable Integer id) {
//        PrioridadeOcorrenciaResponse prioridadeOcorrencia = prioridadeOcorrenciaService.findById(id);
//        return ResponseEntity.ok(prioridadeOcorrencia);
//    }
//}
