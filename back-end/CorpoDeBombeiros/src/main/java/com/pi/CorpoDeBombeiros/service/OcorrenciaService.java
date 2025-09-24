package com.pi.CorpoDeBombeiros.service;

import com.pi.CorpoDeBombeiros.dto.OcorrenciaDTO;
import com.pi.CorpoDeBombeiros.dto.OcorrenciaRequestDTO;
import com.pi.CorpoDeBombeiros.model.EnderecoModel;
import com.pi.CorpoDeBombeiros.model.OcorrenciaModel;
import com.pi.CorpoDeBombeiros.repository.OcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;

    private OcorrenciaDTO toDTO(OcorrenciaModel ocorrencia) {
        return new OcorrenciaDTO(
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

    private OcorrenciaModel toModel(OcorrenciaRequestDTO ocorrenciaRequest) {
        return OcorrenciaModel.builder()
                .nomeSolicitante(ocorrenciaRequest.getNomeSolicitante())
                .telefoneSolicitante(ocorrenciaRequest.getTelefoneSolicitante())
                .dataOcorrencia(LocalDateTime.now())
                .latitude(ocorrenciaRequest.getLatitude())
                .longitude(ocorrenciaRequest.getLongitude())
                .build();


    }

    private String formatEndereco(EnderecoModel endereco) {
        return endereco.getRua() + ", " + endereco.getNumero() + " - " +
                endereco.getBairro() + ", " + endereco.getCidade() + " - CEP: " + endereco.getCep();
    }

    public List<OcorrenciaDTO> findAll() {
        return ocorrenciaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OcorrenciaDTO findById(Integer id) {
        OcorrenciaModel ocorrencia = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));
        return toDTO(ocorrencia);
    }

    public List<OcorrenciaDTO> findByStatus(String status) {
        return ocorrenciaRepository.findByFkStatusOcorrencia_NomeStatus(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OcorrenciaDTO create(OcorrenciaRequestDTO ocorrenciaRequest) {
        OcorrenciaModel ocorrencia = toModel(ocorrenciaRequest);
        OcorrenciaModel ocorrenciaSalva = ocorrenciaRepository.save(ocorrencia);
        return toDTO(ocorrenciaSalva);
    }

    public OcorrenciaDTO update(Integer id, OcorrenciaRequestDTO ocorrenciaRequest) {
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
