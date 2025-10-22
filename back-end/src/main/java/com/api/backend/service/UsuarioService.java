package com.api.backend.service;

import com.api.backend.dto.UsuarioResponse;
import com.api.backend.dto.UsuarioRequest;
import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ 1. INJEÇÃO CORRIGIDA: Renomeado de 'driveService' para 'cloudinaryService'
    private final CloudinaryService cloudinaryService;

    // ... (Métodos auxiliares toDTO e getFileExtension - Mantidos)

    private UsuarioResponse toDTO(UsuarioModel usuario) {
        String ultimoLoginString = Optional.ofNullable(usuario.getUltimoLogin())
                .map(LocalDateTime::toString)
                .orElse("N/A - Novo Usuário");

        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNomeUsuario(),
                usuario.getCpf(),
                usuario.getEmail(),
                usuario.getTipoUsuario().toString(),
                usuario.getCaminhoFoto(),
                usuario.getDataCriacao().toString(),
                ultimoLoginString
        );
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) return "";
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
    }

    // --- Métodos de Busca (Mantidos) ---

    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioResponse findById(Integer id) {
        UsuarioModel usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return toDTO(usuario);
    }

    public UsuarioResponse findByCpf(String cpf) {
        UsuarioModel usuario = usuarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return toDTO(usuario);
    }

    // --- Método de Cadastro (Create) Atualizado ---

    // ✅ 2. MÉTODO ATUALIZADO: Recebe a foto E o anexoPdf
    public UsuarioResponse create(UsuarioRequest usuarioRequest, MultipartFile foto) {

        // 1. Validação de Duplicidade
        if (usuarioRepository.existsByCpf(usuarioRequest.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O CPF informado já está cadastrado.");
        }

        // 2. Upload da Foto
        String caminhoFoto = null;
        if (foto != null && !foto.isEmpty()) {
            // Usa o CPF como Public ID e define a pasta
            String publicIdFoto = usuarioRequest.getCpf() + "-foto";
            String folderFoto = "bombeiros/fotos-usuarios";

            // ✅ CHAMADA CORRETA: Usa o CloudinaryService com pasta e ID
            caminhoFoto = cloudinaryService.uploadFile(foto, folderFoto, publicIdFoto);
        }


        // 4. Persistência do Usuário
        String senhaCriptografada = passwordEncoder.encode(usuarioRequest.getSenha());

        UsuarioModel usuario = UsuarioModel.builder()
                .nomeUsuario(usuarioRequest.getNomeUsuario())
                .cpf(usuarioRequest.getCpf())
                .email(usuarioRequest.getEmail())
                .tipoUsuario(UsuarioModel.TipoUsuario.valueOf(usuarioRequest.getTipoUsuario()))
                .senha(senhaCriptografada)
                .caminhoFoto(caminhoFoto)
                .dataCriacao(LocalDateTime.now())
                .build();

        UsuarioModel usuarioSalvo = usuarioRepository.save(usuario);
        return toDTO(usuarioSalvo);
    }

    // --- Métodos de Atualização e Exclusão (Mantidos) ---

    public UsuarioResponse update(String cpf, UsuarioRequest usuarioRequest,  MultipartFile foto) {
        UsuarioModel usuarioExistente = usuarioRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // 🆕 LÓGICA DE ATUALIZAÇÃO DA FOTO (via Cloudinary)
        if (foto != null && !foto.isEmpty()) {
            // Usa o CPF do usuário existente como Public ID para substituir a foto
            String publicIdFoto = usuarioExistente.getCpf() + "-foto";
            String folderFoto = "bombeiros/fotos-usuarios";

            // 1. Faz upload e obtém o novo caminho
            String novoCaminhoFoto = cloudinaryService.uploadFile(foto, folderFoto, publicIdFoto);

            // 2. Atualiza o caminho no modelo
            usuarioExistente.setCaminhoFoto(novoCaminhoFoto);
        }
        // Se 'foto' for nula/vazia, o caminho existente é mantido.

        // Lógica de atualização dos outros campos
        if (usuarioRequest.getNomeUsuario() != null && !usuarioRequest.getNomeUsuario().isEmpty()) {
            usuarioExistente.setNomeUsuario(usuarioRequest.getNomeUsuario());
        }

        if (usuarioRequest.getCpf() != null && !usuarioRequest.getCpf().isEmpty()) {
            // Manter a atualização do CPF, mas deve ser usado com cautela, pois é um identificador
            usuarioExistente.setCpf(usuarioRequest.getCpf());
        }
        if (usuarioRequest.getEmail()!= null && !usuarioRequest.getEmail().isEmpty()) {
            usuarioExistente.setEmail(usuarioRequest.getEmail());
        }

        if (usuarioRequest.getTipoUsuario() != null && !usuarioRequest.getTipoUsuario().isEmpty()) {
            usuarioExistente.setTipoUsuario(UsuarioModel.TipoUsuario.valueOf(usuarioRequest.getTipoUsuario()));
        }

        if (usuarioRequest.getSenha() != null && !usuarioRequest.getSenha().isEmpty()) {
            String novaSenhaCriptografada = passwordEncoder.encode(usuarioRequest.getSenha());
            usuarioExistente.setSenha(novaSenhaCriptografada);
        }

        UsuarioModel usuarioAtualizado = usuarioRepository.save(usuarioExistente);
        return toDTO(usuarioAtualizado);
    }

    public void delete(String cpf) {
        if(!usuarioRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        usuarioRepository.deleteByCpf(cpf);
    }
}