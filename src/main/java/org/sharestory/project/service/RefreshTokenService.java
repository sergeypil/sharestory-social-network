package org.sharestory.project.service;

import org.sharestory.project.dto.RefreshTokenRequest;
import org.sharestory.project.exceptions.SpringSharestoryException;
import org.sharestory.project.model.RefreshToken;
import org.sharestory.project.model.User;
import org.sharestory.project.repository.RefreshTokenRepository;
import org.sharestory.project.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public RefreshToken generateRefreshToken(User user) {
    	RefreshToken refreshToken = refreshTokenRepository.findByUser(user).orElse(new RefreshToken());
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setCreatedDate(Instant.now());
        refreshToken.setUser(user);
        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken generateRefreshToken(User user, RefreshToken refreshToken) {
        refreshToken.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(refreshToken);
    }
    
    @Transactional(readOnly = true)
    public RefreshToken validateRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new SpringSharestoryException("Invalid refresh Token"));
    }

    @Transactional
    public void deleteRefreshToken(RefreshTokenRequest refreshTokenRequest) {
    	User user = userRepository.findByUsername(refreshTokenRequest.getUsername())
    			.orElseThrow(() -> new UsernameNotFoundException("User name not found - "
        				+ refreshTokenRequest.getUsername()));
    	RefreshToken refreshToken = refreshTokenRepository
    			.findByTokenAndUser(refreshTokenRequest.getRefreshToken(), user)
    			.orElseThrow(() -> new SpringSharestoryException("Invalid refresh Token"));
        refreshTokenRepository.delete(refreshToken);
    }
}
