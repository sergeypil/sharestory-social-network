package org.sharestory.project.controller;

import org.sharestory.project.dto.AuthenticationResponse;
import org.sharestory.project.dto.LoginRequest;
import org.sharestory.project.dto.MessageResponse;
import org.sharestory.project.dto.RefreshTokenRequest;
import org.sharestory.project.dto.RegisterRequest;
import org.sharestory.project.service.AuthService;
import org.sharestory.project.service.RefreshTokenService;
import org.sharestory.project.service.UserService;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
//@CrossOrigin(origins = "http://localhost:8080")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
        	String str = bindingResult.getFieldErrors().stream().map(err -> err.getDefaultMessage())
        			.reduce("",(subtotal, err) -> subtotal + "\n" + err);
            return new ResponseEntity<>(new MessageResponse(str),
					HttpStatus.BAD_REQUEST);}
    	
    	if (userService.existsByUsername(registerRequest.getUsername())) {
			return new ResponseEntity<>(new MessageResponse("Error: Username is already taken!"),
					HttpStatus.BAD_REQUEST);
		}
		if (userService.existsByEmail(registerRequest.getEmail())) {
			return new ResponseEntity<>(new MessageResponse("Error: Email is already in use!"),
					HttpStatus.BAD_REQUEST);
		}
        authService.signup(registerRequest);
        return new ResponseEntity<>(new MessageResponse("User Registration Successful"), HttpStatus.OK);
    }

    @GetMapping("accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        authService.verifyAccount(token);
        return new ResponseEntity<>("Email confirmed Successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }
    
    //a refresh token to get a new access(jwt) token
    @PostMapping("/refresh/token")
    public AuthenticationResponse refreshTokens(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return authService.refreshToken(refreshTokenRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.deleteRefreshToken(refreshTokenRequest);
        return new ResponseEntity<>(new MessageResponse("Refresh Token Deleted Successfully!!"), HttpStatus.OK);
    }
}
