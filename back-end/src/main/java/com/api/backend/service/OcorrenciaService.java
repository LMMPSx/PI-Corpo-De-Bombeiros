package com.api.backend.service;

import com.api.backend.dto.OcorrenciaResponse;
import com.api.backend.dto.OcorrenciaRequest;
import com.api.backend.model.OcorrenciaModel;
import com.api.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;

    private OcorrenciaResponse toDTO(OcorrenciaModel ocorrencia) {
        return new OcorrenciaResponse(
                ocorrencia.getIdOcorrencia(),
                ocorrencia.getNaturezaOcorrencia().toString(),
                ocorrencia.getNomeSolicitante(),
                ocorrencia.getDataOcorrencia().toString(),
                ocorrencia.getDescricao(),
                ocorrencia.getLocalizacao(),
                ocorrencia.getLatitude(),
                ocorrencia.getLongitude(),
                ocorrencia.getPrioridadeOcorrencia().toString(),
                ocorrencia.getAnexoOcorrencia(),
                ocorrencia.getStatusOcorrencia().toString(),
                ocorrencia.getAssinaturaOcorrencia()

        );
    }

    private OcorrenciaModel toModel(OcorrenciaRequest ocorrenciaRequest) {
        return OcorrenciaModel.builder()
                .naturezaOcorrencia(OcorrenciaModel.NaturezaOcorrencia.valueOf(ocorrenciaRequest.getNaturezaOcorrencia()))
                .nomeSolicitante(ocorrenciaRequest.getNomeSolicitante())
                .dataOcorrencia(LocalDateTime.now())
                .descricao(ocorrenciaRequest.getDescricao())
                .localizacao(ocorrenciaRequest.getLocalizacao())
                .latitude(ocorrenciaRequest.getLatitude())
                .longitude(ocorrenciaRequest.getLongitude())
                .prioridadeOcorrencia(OcorrenciaModel.PrioridadeOcorrencia.valueOf(ocorrenciaRequest.getPrioridadeOcorrencia()))
                .anexoOcorrencia(ocorrenciaRequest.getAnexoOcorrencia())
                .statusOcorrencia(OcorrenciaModel.StatusOcorrencia.valueOf(ocorrenciaRequest.getStatusOcorrencia()))
                .assinaturaOcorrencia(ocorrenciaRequest.getAssinaturaOcorrencia())
                .build();
    }


    public List<OcorrenciaResponse> findAll() {
        return ocorrenciaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OcorrenciaResponse findById(Integer id) {
        OcorrenciaModel ocorrencia = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));
        return toDTO(ocorrencia);
    }

    public List<OcorrenciaResponse> findByStatus(String status) {
        return ocorrenciaRepository.findByStatusOcorrencia(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OcorrenciaResponse> findByPrioridade(String nomePrioridade) {
        return ocorrenciaRepository.findByPrioridadeOcorrencia(nomePrioridade)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    public OcorrenciaResponse create(OcorrenciaRequest ocorrenciaRequest) {
        OcorrenciaModel ocorrencia = toModel(ocorrenciaRequest);
        OcorrenciaModel ocorrenciaSalva = ocorrenciaRepository.save(ocorrencia);
        return toDTO(ocorrenciaSalva);
    }

    public OcorrenciaResponse update(Integer id, OcorrenciaRequest ocorrenciaRequest) {
        OcorrenciaModel ocorrenciaExistente = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));

        if (ocorrenciaRequest.getNaturezaOcorrencia() != null && !ocorrenciaRequest.getNaturezaOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setNaturezaOcorrencia(OcorrenciaModel.NaturezaOcorrencia.valueOf(ocorrenciaRequest.getNaturezaOcorrencia()));
        }

        if (ocorrenciaRequest.getNomeSolicitante() != null && !ocorrenciaRequest.getNomeSolicitante().trim().isEmpty()) {
            ocorrenciaExistente.setNomeSolicitante(ocorrenciaRequest.getNomeSolicitante());
        }

        if (ocorrenciaRequest.getDescricao() != null && !ocorrenciaRequest.getDescricao().trim().isEmpty()) {
            ocorrenciaExistente.setDescricao(ocorrenciaRequest.getDescricao());
        }

        if (ocorrenciaRequest.getLocalizacao() != null && !ocorrenciaRequest.getLocalizacao().trim().isEmpty()) {
            ocorrenciaExistente.setLocalizacao(ocorrenciaRequest.getLocalizacao());
        }

        if (ocorrenciaRequest.getLatitude() != null) {
            ocorrenciaExistente.setLatitude(ocorrenciaRequest.getLatitude());
        }

        if (ocorrenciaRequest.getLongitude() != null) {
            ocorrenciaExistente.setLongitude(ocorrenciaRequest.getLongitude());
        }

        if (ocorrenciaRequest.getPrioridadeOcorrencia() != null && !ocorrenciaRequest.getPrioridadeOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setPrioridadeOcorrencia(OcorrenciaModel.PrioridadeOcorrencia.valueOf(ocorrenciaRequest.getPrioridadeOcorrencia()));
        }

        if (ocorrenciaRequest.getAnexoOcorrencia() != null && !ocorrenciaRequest.getAnexoOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setAnexoOcorrencia(ocorrenciaRequest.getAnexoOcorrencia());
        }

        if (ocorrenciaRequest.getStatusOcorrencia() != null && !ocorrenciaRequest.getStatusOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setStatusOcorrencia(OcorrenciaModel.StatusOcorrencia.valueOf(ocorrenciaRequest.getStatusOcorrencia()));
        }

        if (ocorrenciaRequest.getAssinaturaOcorrencia() != null && !ocorrenciaRequest.getAssinaturaOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setAssinaturaOcorrencia(ocorrenciaRequest.getAssinaturaOcorrencia());
        }

        OcorrenciaModel ocorrenciaAtualizada = ocorrenciaRepository.save(ocorrenciaExistente);
        return toDTO(ocorrenciaAtualizada);
    }

    public void delete(Integer id) {
        if(!ocorrenciaRepository.existsById(id)) {
            throw new RuntimeException("Ocorrência não encontrada");
        }
        ocorrenciaRepository.deleteById(id);
    }
}
