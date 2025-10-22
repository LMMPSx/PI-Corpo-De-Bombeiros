//package com.api.backend.controller;
//
//import com.api.backend.dto.TipoOcorrenciaResponse;
//import com.api.backend.service.TipoOcorrenciaService;
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
//@RequestMapping("/tipo-ocorrencia")
//@RequiredArgsConstructor
//public class TipoOcorrenciaController {
//
//    private final TipoOcorrenciaService tipoOcorrenciaService;
//
//    @GetMapping("/all")
//    public ResponseEntity<List<TipoOcorrenciaResponse>> findAll() {
//        List<TipoOcorrenciaResponse> tipoOcorrencia = tipoOcorrenciaService.findAll();
//        return ResponseEntity.ok(tipoOcorrencia);
//    }
//
//    @GetMapping("/id/{id}")
//    public ResponseEntity<TipoOcorrenciaResponse> findById(@PathVariable Integer id) {
//        TipoOcorrenciaResponse tipoOcorrencia = tipoOcorrenciaService.findById(id);
//        return ResponseEntity.ok(tipoOcorrencia);
//    }
//
//    @GetMapping("nome-tipo/{nomeTipo}")
//    public ResponseEntity<List<TipoOcorrenciaResponse>> findByNomeTipo(@PathVariable String nomeTipo) {
//        List<TipoOcorrenciaResponse> tipoOcorrencia = tipoOcorrenciaService.findByNomeTipo(nomeTipo);
//        return ResponseEntity.ok(tipoOcorrencia);
//    }
//}
