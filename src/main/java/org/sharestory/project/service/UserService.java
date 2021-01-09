package org.sharestory.project.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.sharestory.project.model.User;
import org.sharestory.project.repository.RefreshTokenRepository;
import org.sharestory.project.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	
	public boolean existsByUsername(String username) {
		return userRepository.existsByUsername(username);
	}

	public boolean existsByEmail(String email) {
		return userRepository.existsByEmail(email);
	}
	
	@Transactional
	public void deleteUser(Long id) {
		User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User name not found - " + id));
		refreshTokenRepository.deleteByUser(user);
		userRepository.delete(user);
	}
}
