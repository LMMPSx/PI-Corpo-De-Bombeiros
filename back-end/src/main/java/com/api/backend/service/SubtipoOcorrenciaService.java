package com.api.backend.service;

import com.api.backend.dto.SubtipoOcorrenciaResponse;
import com.api.backend.model.SubtipoOcorrenciaModel;
import com.api.backend.repository.SubtipoOcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubtipoOcorrenciaService {

    private final SubtipoOcorrenciaRepository subtipoOcorrenciaRepository;

    private SubtipoOcorrenciaResponse toDTO(SubtipoOcorrenciaModel subtipoOcorrencia) {
        return new SubtipoOcorrenciaResponse(
                subtipoOcorrencia.getIdSubtipo(),
                subtipoOcorrencia.getNomeSubtipo(),
                subtipoOcorrencia.getDescricaoSubtipo()
        );

    }

    public List<SubtipoOcorrenciaResponse> findAll() {
        return subtipoOcorrenciaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SubtipoOcorrenciaResponse findById(Integer id) {
        SubtipoOcorrenciaModel subtipoOcorrencia = subtipoOcorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtipo de Ocorrencia não encontrada"));
        return toDTO(subtipoOcorrencia);
    }

    public List<SubtipoOcorrenciaResponse> findByNomeSubtipo(String nomeSubtipo) {
        return subtipoOcorrenciaRepository.findByNomeSubtipo(nomeSubtipo)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
