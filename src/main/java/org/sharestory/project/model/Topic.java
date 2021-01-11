package org.sharestory.project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique=true)
    @NotBlank(message = "Name of topic is required")
    private String name;
    
    @NotBlank(message = "Description is required")
    private String description;
 
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true, mappedBy = "topic")
    private List<Post> posts;
    
    private Instant createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}
