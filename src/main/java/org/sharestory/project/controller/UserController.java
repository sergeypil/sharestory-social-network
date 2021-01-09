package org.sharestory.project.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.sharestory.project.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {
	
	private final UserService userService;
	
	@PostMapping("/delete/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteUser(@PathVariable("id") Long id) {
		userService.deleteUser(id);
	}
}