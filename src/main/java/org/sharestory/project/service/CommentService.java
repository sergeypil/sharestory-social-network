package org.sharestory.project.service;

import org.ocpsoft.prettytime.PrettyTime;
import org.sharestory.project.dto.CommentRequest;
import org.sharestory.project.dto.CommentResponse;
import org.sharestory.project.exceptions.CommentNotFoundException;
import org.sharestory.project.exceptions.PostNotFoundException;
import org.sharestory.project.model.Comment;
import org.sharestory.project.model.Post;
import org.sharestory.project.model.User;
import org.sharestory.project.repository.CommentRepository;
import org.sharestory.project.repository.PostRepository;
import org.sharestory.project.repository.UserRepository;
import org.sharestory.project.utilentity.NotificationEmail;

import lombok.AllArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


import static java.util.stream.Collectors.toList;

import java.time.Instant;

@Service
@AllArgsConstructor
public class CommentService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final CommentRepository commentRepository;
    private final MailService mailService;

    @Transactional
    public void save(CommentRequest commentRequest) {
		  Post post = postRepository.findById(commentRequest.getPostId())
		  .orElseThrow(() -> new PostNotFoundException(commentRequest.getPostId().toString())); 
		  Comment comment = mapToComment(commentRequest, post, authService.getCurrentUser());
		  commentRepository.save(comment);
		  
		  String message = authService.getCurrentUser().getUsername() +
				  			" posted a comment on your post " + post.getPostName();
		  mailService.sendMail(new NotificationEmail("Your post is commented", post.getUser().getEmail(), message), false);
	  }
	 
    @Transactional(readOnly = true)
    public List<CommentResponse> getAllCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId.toString()));
        return commentRepository.findByPost(post)
                .stream()
                .map(this::mapToResponse).collect(toList());
    }
    @Transactional(readOnly = true)
    public List<CommentResponse> getAllCommentsForUser(String userName) {
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new UsernameNotFoundException(userName));
        return commentRepository.findAllByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(toList());
    }
    
	@Transactional
    @PreAuthorize("hasRole('ROLE_ADMIN') or #comment.user.username == principal.username")
	public void deleteComment(Comment comment) {
		commentRepository.delete(comment);
	}

    @Transactional(readOnly = true)
	public Comment getCommentById(Long id) {
		return commentRepository.findById(id).orElseThrow(() -> new CommentNotFoundException(id.toString()));
	}
	
	private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .text(comment.getText())
                .postId(comment.getPost().getId())
                .createdDate(new PrettyTime().format(comment.getCreatedDate()))
                .username(comment.getUser().getUsername())
                .build();
    }

    private Comment mapToComment(CommentRequest commentRequest, Post post, User user) {
        return Comment.builder()
                .text(commentRequest.getText())
                .post(post)
                .createdDate(Instant.now())
                .user(user)
                .build();
    }
}
