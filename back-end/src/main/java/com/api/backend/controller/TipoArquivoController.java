package com.api.backend.controller;

import com.api.backend.dto.TipoArquivoResponse;
import com.api.backend.service.TipoArquivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tipo-arquivo")
@RequiredArgsConstructor
public class TipoArquivoController {
    private final TipoArquivoService tipoArquivoService;

    @GetMapping("/all")
    public ResponseEntity<List<TipoArquivoResponse>> findAll(){
       List<TipoArquivoResponse> tipoArquivo = tipoArquivoService.findAll();
               return ResponseEntity.ok(tipoArquivo);
    }

    @GetMapping("/id/{id}")
    public  ResponseEntity<TipoArquivoResponse> findById(@PathVariable Integer id){
        TipoArquivoResponse tipoArquivo = tipoArquivoService.findById(id);
        return ResponseEntity.ok(tipoArquivo);
    }

    @GetMapping("/nome/{nomeTipoArquivo}")
    public  ResponseEntity<List<TipoArquivoResponse>>findByNomeTipoArquivo(@PathVariable String nomeTipoArquivo){
        List<TipoArquivoResponse> tipoArquivo = tipoArquivoService.findByNomeTipoArquivo(nomeTipoArquivo);
        return ResponseEntity.ok(tipoArquivo);
    }


}
