package com.pi.CorpoDeBombeiros.service;

import com.pi.CorpoDeBombeiros.dto.OcorrenciaDTO;
import com.pi.CorpoDeBombeiros.dto.OcorrenciaRequestDTO;
import com.pi.CorpoDeBombeiros.model.EnderecoModel;
import com.pi.CorpoDeBombeiros.model.OcorrenciaModel;
import com.pi.CorpoDeBombeiros.repository.OcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    private String formatEndereco(EnderecoModel endereco) {
        return endereco.getRua() + ", " + endereco.getNumero() + " - " +
                endereco.getBairro() + ", " + endereco.getCidade() + " - CEP: " + endereco.getCep();
    }
}
