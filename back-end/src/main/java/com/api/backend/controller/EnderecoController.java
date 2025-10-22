//package com.api.backend.controller;
//
//import com.api.backend.dto.EnderecoRequest;
//import com.api.backend.dto.EnderecoResponse;
//import com.api.backend.service.EnderecoService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/endereco")
//@RequiredArgsConstructor
//public class EnderecoController {
//
//    private final EnderecoService enderecoService;
//
//    @GetMapping("/all")
//    public ResponseEntity<List<EnderecoResponse>> findAll() {
//        List<EnderecoResponse> endereco = enderecoService.findAll();
//        return ResponseEntity.ok(endereco);
//    }
//
//    @GetMapping("/id/{id}")
//    public ResponseEntity<EnderecoResponse> findById(@PathVariable Integer id) {
//        EnderecoResponse endereco = enderecoService.findById(id);
//        return ResponseEntity.ok(endereco);
//    }
//
//    @PostMapping("/create")
//    public ResponseEntity<EnderecoResponse> create(@RequestBody EnderecoRequest enderecoRequest) {
//        EnderecoResponse enderecoCriado = enderecoService.create(enderecoRequest);
//        return ResponseEntity.status(HttpStatus.CREATED).body(enderecoCriado);
//    }
//
//    @PutMapping("/update/{id}")
//    public ResponseEntity<EnderecoResponse> update(@PathVariable Integer id, @RequestBody EnderecoRequest enderecoRequest) {
//        EnderecoResponse enderecoAtualizado = enderecoService.update(id, enderecoRequest);
//        return  ResponseEntity.ok(enderecoAtualizado);
//    }
//
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<EnderecoResponse> delete(@PathVariable Integer id) {
//        enderecoService.delete(id);
//        return ResponseEntity.noContent().build();
//    }
//}
