package com.api.backend.controller;

import com.api.backend.dto.AnexosRequest;
import com.api.backend.dto.AnexosResponse;
import com.api.backend.dto.AssinaturaRequest;
import com.api.backend.dto.AssinaturaResponse;
import com.api.backend.service.AssinaturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assinatura")
@RequiredArgsConstructor
public class AssinaturaController {
    private final AssinaturaService assinaturaService;

    @GetMapping("/all")
    public ResponseEntity<List<AssinaturaResponse>> findAll(){
        List<AssinaturaResponse> assinaturaResponse = assinaturaService.findAll();
        return ResponseEntity.ok(assinaturaResponse);
    }
@GetMapping("id/{id}")
    public  ResponseEntity<AssinaturaResponse> findById(@PathVariable Integer id){
        AssinaturaResponse assinaturaResponse = assinaturaService.FindById(id);
        return ResponseEntity.ok(assinaturaResponse);
}
    @PostMapping("/create")
    public ResponseEntity<AssinaturaResponse> create(@RequestBody AssinaturaRequest assinaturaRequest){
        AssinaturaResponse assinaturaCreate = assinaturaService.create(assinaturaRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(assinaturaCreate);
    }
    @PutMapping("/update")
    public ResponseEntity<AssinaturaResponse> update(@PathVariable Integer id, @RequestBody AssinaturaRequest assinaturaRequest){
        AssinaturaResponse assinaturaAtualizada = assinaturaService.update(id, assinaturaRequest);
        return ResponseEntity.ok(assinaturaAtualizada);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<AssinaturaResponse> delete(@PathVariable Integer id){
        assinaturaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
