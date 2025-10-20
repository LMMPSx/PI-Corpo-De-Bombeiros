//package com.api.backend.service;
//
//import com.api.backend.dto.EnderecoRequest;
//import com.api.backend.dto.EnderecoResponse;
//import com.api.backend.model.EnderecoModel;
//import com.api.backend.repository.EnderecoRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class EnderecoService {
//
//    private final EnderecoRepository enderecoRepository;
//
//    private EnderecoResponse toDTO(EnderecoModel enderecoModel) {
//        return new EnderecoResponse(
//                enderecoModel.getIdEndereco(),
//                enderecoModel.getCep(),
//                enderecoModel.getCidade(),
//                enderecoModel.getBairro(),
//                enderecoModel.getRua(),
//                enderecoModel.getNumero(),
//                enderecoModel.getPontoReferencia()
//        );
//    }
//
//    private EnderecoModel toModel(EnderecoRequest enderecoRequest) {
//        return EnderecoModel.builder()
//                .cep(enderecoRequest.getCep())
//                .cidade(enderecoRequest.getCidade())
//                .bairro(enderecoRequest.getBairro())
//                .rua(enderecoRequest.getRua())
//                .numero(enderecoRequest.getNumero())
//                .pontoReferencia(enderecoRequest.getPontoReferencia())
//                .build();
//    }
//
//    public List<EnderecoResponse> findAll() {
//        return enderecoRepository.findAll()
//                .stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
//
//    public EnderecoResponse findById(Integer id) {
//        EnderecoModel endereco = enderecoRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
//        return toDTO(endereco);
//    }
//
//    public EnderecoResponse create(EnderecoRequest enderecoRequest) {
//        EnderecoModel endereco = toModel(enderecoRequest);
//        EnderecoModel enderecoSalvo = enderecoRepository.save(endereco);
//        return toDTO(enderecoSalvo);
//    }
//
//    public EnderecoResponse update(Integer id, EnderecoRequest enderecoRequest) {
//        EnderecoModel enderecoExistente = enderecoRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
//
//        if (enderecoRequest.getCep() != null && !enderecoRequest.getCep().trim().isEmpty()) {
//            enderecoExistente.setCep(enderecoRequest.getCep());
//        }
//
//        if (enderecoRequest.getCidade() != null && !enderecoRequest.getCidade().trim().isEmpty()) {
//            enderecoExistente.setCidade(enderecoRequest.getCidade());
//        }
//
//        if (enderecoRequest.getBairro() != null && !enderecoRequest.getBairro().trim().isEmpty()) {
//            enderecoExistente.setBairro(enderecoRequest.getBairro());
//        }
//
//        if (enderecoRequest.getRua() != null && !enderecoRequest.getRua().trim().isEmpty()) {
//            enderecoExistente.setRua(enderecoRequest.getRua());
//        }
//
//        if (enderecoRequest.getNumero() != null && !enderecoRequest.getNumero().trim().isEmpty()) {
//            enderecoExistente.setNumero(enderecoRequest.getNumero());
//        }
//
//        if (enderecoRequest.getPontoReferencia() != null && !enderecoRequest.getPontoReferencia().trim().isEmpty()) {
//            enderecoExistente.setPontoReferencia(enderecoRequest.getPontoReferencia());
//
//        }
//
//        EnderecoModel enderecoAtualizado = enderecoRepository.save(enderecoExistente);
//        return toDTO(enderecoAtualizado);
//    }
//
//    public void delete(Integer id) {
//        if (!enderecoRepository.existsById(id)) {
//            throw new RuntimeException("Endereço não encontrado");
//        }
//        enderecoRepository.deleteById(id);
//    }
//}
