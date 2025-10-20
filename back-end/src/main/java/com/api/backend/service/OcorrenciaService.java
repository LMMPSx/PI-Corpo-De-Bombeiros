package com.api.backend.service;

import com.api.backend.dto.OcorrenciaResponse;
import com.api.backend.dto.OcorrenciaRequest;
import com.api.backend.model.EnderecoModel;
import com.api.backend.model.OcorrenciaModel;
import com.api.backend.repository.*;
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
    private final PrioridadeOcorrenciaRepository prioridadeRepository;
    private final StatusOcorrenciaRepository statusRepository;
    private final TipoOcorrenciaRepository tipoRepository;
    private final SubtipoOcorrenciaRepository subtipoRepository;
    private final EnderecoRepository enderecoRepository;
    private final UsuarioRepository usuarioRepository;

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

        var prioridade = prioridadeRepository.findById(ocorrenciaRequest.getFkPrioridadeOcorrencia())
                .orElseThrow(() -> new RuntimeException("Prioridade não encontrada com o ID fornecido."));

        var status = statusRepository.findById(ocorrenciaRequest.getFkStatusOcorrencia())
                .orElseThrow(() -> new RuntimeException("Status não encontrado com o ID fornecido."));

        var tipo = tipoRepository.findById(ocorrenciaRequest.getFkTipoOcorrencia())
                .orElseThrow(() -> new RuntimeException("Tipo não encontrado com o ID fornecido."));

        var subtipo = subtipoRepository.findById(ocorrenciaRequest.getFkSubtipoOcorrencia())
                .orElseThrow(() -> new RuntimeException("Subtipo não encontrado com o ID fornecido."));

        var endereco = enderecoRepository.findById(ocorrenciaRequest.getEnderecoOcorrencia())
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        var usuario = usuarioRepository.findById(ocorrenciaRequest.getFkIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID fornecido."));

        return OcorrenciaModel.builder()
                .nomeSolicitante(ocorrenciaRequest.getNomeSolicitante())
                .telefoneSolicitante(ocorrenciaRequest.getTelefoneSolicitante())
                .dataOcorrencia(LocalDateTime.now())
                .latitude(ocorrenciaRequest.getLatitude())
                .longitude(ocorrenciaRequest.getLongitude())
                .fkPrioridadeOcorrencia(prioridade)
                .fkStatusOcorrencia(status)
                .fkTipoOcorrencia(tipo)
                .fkSubtiboOcorrencia(subtipo)
                .enderecoOcorrencia(endereco)
                .fkIdUsuario(usuario)
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

        if (ocorrenciaRequest.getNomeSolicitante() != null && !ocorrenciaRequest.getNomeSolicitante().trim().isEmpty()) {
            ocorrenciaExistente.setNomeSolicitante(ocorrenciaRequest.getNomeSolicitante());
        }

        if (ocorrenciaRequest.getTelefoneSolicitante() != null && !ocorrenciaRequest.getTelefoneSolicitante().trim().isEmpty()) {
            ocorrenciaExistente.setTelefoneSolicitante(ocorrenciaRequest.getTelefoneSolicitante());
        }

        if (ocorrenciaRequest.getLatitude() != null) {
            ocorrenciaExistente.setLatitude(ocorrenciaRequest.getLatitude());
        }

        if (ocorrenciaRequest.getLongitude() != null) {
            ocorrenciaExistente.setLongitude(ocorrenciaRequest.getLongitude());
        }

        if (ocorrenciaRequest.getFkPrioridadeOcorrencia() != null) {
            var prioridade = prioridadeRepository.findById(ocorrenciaRequest.getFkPrioridadeOcorrencia())
                    .orElseThrow(() -> new RuntimeException("Prioridade não encontrada com o ID fornecido."));
            ocorrenciaExistente.setFkPrioridadeOcorrencia(prioridade);
        }

        if (ocorrenciaRequest.getFkStatusOcorrencia() != null) {
            var status = statusRepository.findById(ocorrenciaRequest.getFkStatusOcorrencia())
                    .orElseThrow(() -> new RuntimeException("Status não encontrado com o ID fornecido."));
            ocorrenciaExistente.setFkStatusOcorrencia(status);
        }

        if (ocorrenciaRequest.getFkTipoOcorrencia() != null) {
            var tipo = tipoRepository.findById(ocorrenciaRequest.getFkTipoOcorrencia())
                    .orElseThrow(() -> new RuntimeException("Tipo não encontrado com o ID fornecido."));
            ocorrenciaExistente.setFkTipoOcorrencia(tipo);
        }

        if (ocorrenciaRequest.getFkSubtipoOcorrencia() != null) {
            var subtipo = subtipoRepository.findById(ocorrenciaRequest.getFkSubtipoOcorrencia())
                    .orElseThrow(() -> new RuntimeException("Subtipo não encontrado com o ID fornecido."));
            ocorrenciaExistente.setFkSubtiboOcorrencia(subtipo);
        }

        // Endereço (Aqui, assumimos que o objeto EnderecoModel pode ser enviado no Request,
        // mas se ele tiver um ID próprio, é melhor usar o padrão de ID também!)
        if (ocorrenciaRequest.getEnderecoOcorrencia() != null) {
            var endereco = enderecoRepository.findById(ocorrenciaRequest.getEnderecoOcorrencia())
                            .orElseThrow(() -> new RuntimeException("Endereço não encontrado com o ID fornecido."));
            ocorrenciaExistente.setEnderecoOcorrencia(endereco);
        }

        if (ocorrenciaRequest.getFkIdUsuario() != null) {
            var usuario = usuarioRepository.findById(ocorrenciaRequest.getFkIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID fornecido."));
            ocorrenciaExistente.setFkIdUsuario(usuario);
        }

        // A data da ocorrência (dataOcorrencia) deve ser deixada de fora do update,
        // pois ela representa o momento da abertura.

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
