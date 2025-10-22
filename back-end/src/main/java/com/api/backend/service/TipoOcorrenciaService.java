//package com.api.backend.service;
//
//import com.api.backend.dto.TipoOcorrenciaResponse;
//import com.api.backend.model.TipoOcorrenciaModel;
//import com.api.backend.repository.TipoOcorrenciaRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class TipoOcorrenciaService {
//
//    private final TipoOcorrenciaRepository tipoOcorrenciaRepository;
//
//    private TipoOcorrenciaResponse toDTO(TipoOcorrenciaModel tipoOcorrencia) {
//        return new TipoOcorrenciaResponse(
//                tipoOcorrencia.getIdTipo(),
//                tipoOcorrencia.getNomeTipo(),
//                tipoOcorrencia.getDescricaoTipo(),
//                tipoOcorrencia.getFkIdSubtipo().toString()
//        );
//    }
//
//    public List<TipoOcorrenciaResponse> findAll() {
//        return tipoOcorrenciaRepository.findAll()
//                .stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
//
//    public TipoOcorrenciaResponse findById(Integer id) {
//        TipoOcorrenciaModel tipoOcorrencia = tipoOcorrenciaRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Tipo de ocorrencia não encontrado"));
//        return toDTO(tipoOcorrencia);
//    }
//
//    public List<TipoOcorrenciaResponse> findByNomeTipo(String nomeTipo) {
//        return tipoOcorrenciaRepository.findByNomeTipo(nomeTipo)
//                .stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
//}
