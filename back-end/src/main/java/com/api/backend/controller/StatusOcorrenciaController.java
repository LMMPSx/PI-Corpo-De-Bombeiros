//package com.api.backend.controller;
//
//import com.api.backend.dto.StatusOcorrenciaResponse;
//import com.api.backend.service.StatusOcorrenciaService;
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
//@RequestMapping("/status-ocorrencia")
//@RequiredArgsConstructor
//public class StatusOcorrenciaController {
//
//    private final StatusOcorrenciaService statusOcorrenciaService;
//
//    @GetMapping("/all")
//    public ResponseEntity<List<StatusOcorrenciaResponse>> findAll() {
//        return ResponseEntity.ok(statusOcorrenciaService.findAll());
//    }
//
//    @GetMapping("/id/{id}")
//    public ResponseEntity<StatusOcorrenciaResponse> findById(@PathVariable Integer id) {
//        StatusOcorrenciaResponse statusOcorrencia =  statusOcorrenciaService.findById(id);
//        return ResponseEntity.ok(statusOcorrencia);
//    }
//}
