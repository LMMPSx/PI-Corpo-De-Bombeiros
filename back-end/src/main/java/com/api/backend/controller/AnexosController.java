package com.api.backend.controller;

import com.api.backend.dto.AnexosRequest;
import com.api.backend.dto.AnexosResponse;
import com.api.backend.service.AnexosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/anexos")
@RequiredArgsConstructor
public class AnexosController {
    private final AnexosService anexosService;

    @GetMapping("/all")
    public ResponseEntity<List<AnexosResponse>> findAll(){
        List<AnexosResponse> anexosResponse = anexosService.findAll();
        return ResponseEntity.ok(anexosResponse);
    }
    @PostMapping("/create")
    public ResponseEntity<AnexosResponse> create(@RequestBody AnexosRequest anexosRequest){
        AnexosResponse anexosCreate = anexosService.create(anexosRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(anexosCreate);
    }
    @PutMapping("/update")
    public ResponseEntity<AnexosResponse> update(@PathVariable Integer id, @RequestBody AnexosRequest anexosRequest){
        AnexosResponse anexosAtualizado = anexosService.update(id, anexosRequest);
        return ResponseEntity.ok(anexosAtualizado);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<AnexosResponse> delete(@PathVariable Integer id){
        anexosService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
