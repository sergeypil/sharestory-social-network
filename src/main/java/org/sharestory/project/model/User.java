package org.sharestory.project.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usr")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    //@Column(nullable = false, length = 20, unique = true)
    @NotBlank(message = "Username is required")
    @Size(max = 20)
    private String username;
    
    //@Column(nullable = false)
    @NotBlank(message = "Password is required")
    @Size(min = 3)
    private String password;
    
    //@Column(nullable = false)
    @Email
    @NotEmpty(message = "Email is required")
    private String email;
    
    private Instant created;
    
    private boolean emailConfirmed;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
    		   joinColumns = @JoinColumn(name = "user_id"),
    		   inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    VerificationToken token;
    
	/*
	 * @OneToOne(mappedBy = "user", cascade = CascadeType.ALL) RefreshToken
	 * refToken;
	 */
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Vote> votes;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Comment> comments;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Post> posts;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Topic> topics;
}
