package com.api.backend.service;

import com.api.backend.dto.StatusOcorrenciaResponse;
import com.api.backend.model.StatusOcorrenciaModel;
import com.api.backend.repository.StatusOcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatusOcorrenciaService {

    private final StatusOcorrenciaRepository statusOcorrenciaRepository;

    private StatusOcorrenciaResponse toDTO(StatusOcorrenciaModel status) {
        return new StatusOcorrenciaResponse(status.getIdStatus(), status.getNomeStatus());
    }

    public List<StatusOcorrenciaResponse> findAll() {
        return statusOcorrenciaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StatusOcorrenciaResponse findById(Integer id) {
        StatusOcorrenciaModel status = statusOcorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Status não encontrado"));
        return toDTO(status);
    }
}
