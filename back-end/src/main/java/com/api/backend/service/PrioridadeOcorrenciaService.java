//package com.api.backend.service;
//
//import com.api.backend.dto.PrioridadeOcorrenciaResponse;
//import com.api.backend.model.PrioridadeOcorrenciaModel;
//import com.api.backend.repository.PrioridadeOcorrenciaRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class PrioridadeOcorrenciaService {
//
//    private final PrioridadeOcorrenciaRepository prioridadeOcorrenciaRepository;
//
//    public PrioridadeOcorrenciaResponse toDTO(PrioridadeOcorrenciaModel prioridade) {
//        return new PrioridadeOcorrenciaResponse(prioridade.getIdPrioridade(), prioridade.getNomePrioridade());
//    }
//
//    public List<PrioridadeOcorrenciaResponse> findAll() {
//        return prioridadeOcorrenciaRepository.findAll()
//                .stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
//
//    public PrioridadeOcorrenciaResponse findById(Integer id) {
//        PrioridadeOcorrenciaModel prioridade = prioridadeOcorrenciaRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Prioridade não encontrada"));
//        return toDTO(prioridade);
//    }
//}
