//package com.api.backend.controller;
//
//import com.api.backend.dto.SubtipoOcorrenciaResponse;
//import com.api.backend.service.SubtipoOcorrenciaService;
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
//@RequestMapping("/subtipo-ocorrencia")
//@RequiredArgsConstructor
//public class SubtipoOcorrenciaController {
//
//    private final SubtipoOcorrenciaService SubtipoOcorrenciaService;
//
//    @GetMapping("/all")
//    public ResponseEntity<List<SubtipoOcorrenciaResponse>> findAll() {
//        List<SubtipoOcorrenciaResponse> SubtipoOcorrencia = SubtipoOcorrenciaService.findAll();
//        return ResponseEntity.ok(SubtipoOcorrencia);
//    }
//
//    @GetMapping("/id/{id}")
//    public ResponseEntity<SubtipoOcorrenciaResponse> findById(@PathVariable Integer id) {
//        SubtipoOcorrenciaResponse SubtipoOcorrencia = SubtipoOcorrenciaService.findById(id);
//        return ResponseEntity.ok(SubtipoOcorrencia);
//    }
//
//    @GetMapping("nome-tipo/{nomeTipo}")
//    public ResponseEntity<List<SubtipoOcorrenciaResponse>> findByNomeTipo(@PathVariable String nomeTipo) {
//        List<SubtipoOcorrenciaResponse> SubtipoOcorrencia = SubtipoOcorrenciaService.findByNomeSubtipo(nomeTipo);
//        return ResponseEntity.ok(SubtipoOcorrencia);
//    }
//}
