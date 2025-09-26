package com.api.backend.service;

import com.api.backend.dto.OcorrenciaResponse;
import com.api.backend.dto.OcorrenciaRequest;
import com.api.backend.model.EnderecoModel;
import com.api.backend.model.OcorrenciaModel;
import com.api.backend.repository.OcorrenciaRepository;
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
                ocorrencia.getNomeSolicitante(),
                ocorrencia.getTelefoneSolicitante(),
                ocorrencia.getDataOcorrencia(),
                ocorrencia.getLatitude(),
                ocorrencia.getLongitude(),
                ocorrencia.getFkPrioridadeOcorrencia() != null ?
                        ocorrencia.getFkPrioridadeOcorrencia().getNomePrioridade() : null,
                ocorrencia.getFkStatusOcorrencia() != null ?
                        ocorrencia.getFkStatusOcorrencia().getNomeStatus() : null,
                ocorrencia.getFkTipoOcorrencia() != null ?
                        ocorrencia.getFkTipoOcorrencia().getNomeTipo() : null,
                ocorrencia.getFkSubtiboOcorrencia() != null ?
                        ocorrencia.getFkSubtiboOcorrencia().getNomeSubtipo() : null,
                ocorrencia.getEnderecoOcorrencia() != null ?
                        formatEndereco(ocorrencia.getEnderecoOcorrencia()) : null,
                ocorrencia.getFkIdUsuario() != null ?
                        ocorrencia.getFkIdUsuario().getNomeUsuario() : null
        );
    }

    private OcorrenciaModel toModel(OcorrenciaRequest ocorrenciaRequest) {
        return OcorrenciaModel.builder()
                .nomeSolicitante(ocorrenciaRequest.getNomeSolicitante())
                .telefoneSolicitante(ocorrenciaRequest.getTelefoneSolicitante())
                .dataOcorrencia(LocalDateTime.now())
                .latitude(ocorrenciaRequest.getLatitude())
                .longitude(ocorrenciaRequest.getLongitude())
                .fkPrioridadeOcorrencia(ocorrenciaRequest.getFkPrioridadeOcorrencia())
                .fkStatusOcorrencia(ocorrenciaRequest.getFkStatusOcorrencia())
                .fkTipoOcorrencia(ocorrenciaRequest.getFkTipoOcorrencia())
                .fkSubtiboOcorrencia(ocorrenciaRequest.getFkSubtipoOcorrencia())
                .enderecoOcorrencia(ocorrenciaRequest.getEnderecoOcorrencia())
                .fkIdUsuario(ocorrenciaRequest.getFkIdUsuario())
                .build();
    }

    private String formatEndereco(EnderecoModel endereco) {
        return endereco.getRua() + ", " + endereco.getNumero() + " - " +
                endereco.getBairro() + ", " + endereco.getCidade() + " - CEP: " + endereco.getCep();
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
        return ocorrenciaRepository.findByFkStatusOcorrencia_NomeStatus(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OcorrenciaResponse> findByPrioridade(String nomePrioridade) {
        return ocorrenciaRepository.findByFkPrioridadeOcorrencia_NomePrioridade(nomePrioridade)
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

        ocorrenciaExistente.setNomeSolicitante(ocorrenciaRequest.getNomeSolicitante());
        ocorrenciaExistente.setTelefoneSolicitante(ocorrenciaRequest.getTelefoneSolicitante());
        ocorrenciaExistente.setLatitude(ocorrenciaRequest.getLatitude());
        ocorrenciaExistente.setLongitude(ocorrenciaRequest.getLongitude());

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
