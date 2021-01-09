package org.sharestory.project.repository;

import org.sharestory.project.model.RefreshToken;
import org.sharestory.project.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByTokenAndUser(String token, User user);
    Optional<RefreshToken> findByUser(User user);
    void deleteByUser(User user);
}
