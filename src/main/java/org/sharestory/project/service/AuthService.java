package org.sharestory.project.service;

import org.sharestory.project.dto.AuthenticationResponse;
import org.sharestory.project.dto.LoginRequest;
import org.sharestory.project.dto.RefreshTokenRequest;
import org.sharestory.project.dto.RegisterRequest;
import org.sharestory.project.exceptions.RoleNotFoundException;
import org.sharestory.project.exceptions.SpringSharestoryException;
import org.sharestory.project.model.ERole;
import org.sharestory.project.model.RefreshToken;
import org.sharestory.project.model.Role;
import org.sharestory.project.model.User;
import org.sharestory.project.model.VerificationToken;
import org.sharestory.project.repository.RoleRepository;
import org.sharestory.project.repository.UserRepository;
import org.sharestory.project.repository.VerificationTokenRepository;
import org.sharestory.project.security.JwtProvider;
import org.sharestory.project.utilentity.EmailMessageContent;
import org.sharestory.project.utilentity.NotificationEmail;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

	@Value("${hostname}")
    private String hostName;
	
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;
    private final MailContentBuilder mailContentBuilder;

    @Transactional
    public void signup(RegisterRequest registerRequest) {  	
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setCreated(Instant.now());
        user.setEmailConfirmed(false);
        
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
				.orElseThrow(() -> new RoleNotFoundException("Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);

        String token = generateVerificationToken(user);
        EmailMessageContent emailMessageContent = new EmailMessageContent(user.getUsername(),
        	 "https://sharestory-project.herokuapp.com" + "/api/auth/accountVerification/" + token);
        String htmlPage = mailContentBuilder.build(emailMessageContent);
		  mailService.sendMail(new NotificationEmail("Confirmation email",
		  user.getEmail(), htmlPage), true);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        String username = principal.getUsername();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User name not found - " + principal.getUsername()));
    return user;
    }
    
    @Transactional
    private void fetchUserAndConfirm(VerificationToken verificationToken) {
        String username = verificationToken.getUser().getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new SpringSharestoryException("User not found with name - " + username));
        user.setEmailConfirmed(true);
        userRepository.save(user);
    }

    @Transactional
    private String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationTokenRepository.save(verificationToken);
        return token;
    }

    @Transactional
    public void verifyAccount(String token) {
        Optional<VerificationToken> verificationToken = verificationTokenRepository.findByToken(token);
        fetchUserAndConfirm(verificationToken.orElseThrow(() -> new SpringSharestoryException("Invalid Token")));
    }

    @Transactional
    public AuthenticationResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		Set<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toSet());
        
		User user = userRepository.findByUsername(userDetails.getUsername())
				.orElseThrow(() -> new UsernameNotFoundException("User name not found - "
        				+ userDetails.getUsername()));
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken(user).getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .emailConfirmed(user.isEmailConfirmed())
                .roles(roles)
                .build();
    }

    @Transactional
    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        RefreshToken refreshToken = 
        		refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());

        User user = userRepository.findByUsername(refreshTokenRequest.getUsername())
        		.orElseThrow(() -> new UsernameNotFoundException("User name not found - "
        				+ refreshTokenRequest.getUsername()));
        Set<String> roles = user.getRoles().stream().map(role -> role.getName().toString())
        		.collect(Collectors.toSet());
		return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService
                		.generateRefreshToken(user, refreshToken).getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(refreshTokenRequest.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }

    public boolean isLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }

}