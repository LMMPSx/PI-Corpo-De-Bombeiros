package com.api.backend.service;

import com.api.backend.dto.EnderecoRequest;
import com.api.backend.dto.EnderecoResponse;
import com.api.backend.model.EnderecoModel;
import com.api.backend.repository.EnderecoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    private EnderecoResponse toDTO(EnderecoModel enderecoModel) {
        return new EnderecoResponse(
                enderecoModel.getIdEndereco(),
                enderecoModel.getCep(),
                enderecoModel.getCidade(),
                enderecoModel.getBairro(),
                enderecoModel.getRua(),
                enderecoModel.getNumero(),
                enderecoModel.getPontoReferencia()
        );
    }

    private EnderecoModel toModel(EnderecoRequest enderecoRequest) {
        return EnderecoModel.builder()
                .cep(enderecoRequest.getCep())
                .cidade(enderecoRequest.getCidade())
                .bairro(enderecoRequest.getBairro())
                .rua(enderecoRequest.getRua())
                .numero(enderecoRequest.getNumero())
                .pontoReferencia(enderecoRequest.getPontoReferencia())
                .build();
    }

    public List<EnderecoResponse> findAll() {
        return enderecoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EnderecoResponse findById(Integer id) {
        EnderecoModel endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
        return toDTO(endereco);
    }

    public EnderecoResponse create(EnderecoRequest enderecoRequest) {
        EnderecoModel endereco = toModel(enderecoRequest);
        EnderecoModel enderecoSalvo = enderecoRepository.save(endereco);
        return toDTO(enderecoSalvo);
    }

    public EnderecoResponse update(Integer id, EnderecoRequest enderecoRequest) {
        EnderecoModel enderecoExistente = enderecoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        enderecoExistente.setCep(enderecoRequest.getCep());
        enderecoExistente.setCidade(enderecoRequest.getCidade());
        enderecoExistente.setBairro(enderecoRequest.getBairro());
        enderecoExistente.setRua(enderecoRequest.getRua());
        enderecoExistente.setNumero(enderecoRequest.getNumero());
        enderecoExistente.setPontoReferencia(enderecoRequest.getPontoReferencia());

        EnderecoModel enderecoAtualizado = enderecoRepository.save(enderecoExistente);
        return toDTO(enderecoAtualizado);
    }

    public void delete(Integer id) {
        if (!enderecoRepository.existsById(id)) {
            throw new RuntimeException("Endereço não encontrado");
        }
        enderecoRepository.deleteById(id);
    }
}
