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
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name of post cannot be empty or Null")
    private String postName;
    
    @NotBlank(message = "Description of post cannot be empty or Null")
    @Lob
    private String description;
    
    private boolean edited;
    
    private Integer voteCount;
   
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    private Instant createdDate;
  
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    List<Vote> votes;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    List<Comment> comments;
}
