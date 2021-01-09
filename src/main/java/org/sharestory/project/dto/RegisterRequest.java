package org.sharestory.project.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
	
    @NotBlank(message = "Username cannot be empty")
    @Size(max = 20)
    private String username;
    @NotBlank(message = "Password cannot be empty")
    @Size(min = 3)
    private String password;
    @Email
    @NotEmpty(message = "Email is required")
    private String email;

}
