package com.api.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.cloud-name}") String cloudName,
                             @Value("${cloudinary.api-key}") String apiKey,
                             @Value("${cloudinary.api-secret}") String apiSecret) {

        // Inicializa o cliente Cloudinary usando as variáveis injetadas do application.properties
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true // Garante que a URL gerada é HTTPS
        ));
    }

    /**
     * Faz o upload de um arquivo para o Cloudinary.
     * @param file O arquivo (foto, PDF, etc.) enviado.
     * @param folderName O nome da pasta (ex: "bombeiros/fotos-usuarios").
     * @param publicId O nome único do arquivo (ex: CPF do usuário).
     * @return A URL segura (String) do arquivo hospedado.
     */
    public String uploadFile(MultipartFile file, String folderName, String publicId) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Configurações de upload: define a pasta e o nome único
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folderName,
                            "public_id", publicId,
                            "overwrite", true // Permite substituir se o ID for o mesmo (útil em updates)
                    )
            );

            // Retorna a URL segura (HTTPS) do arquivo
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            System.err.println("Falha ao enviar arquivo para o Cloudinary: " + e.getMessage());
            // Lança uma exceção para ser capturada e tratada pelo Spring
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Falha no upload do arquivo na nuvem.", e);
        }
    }
}