package org.sharestory.project.controller;

import org.sharestory.project.dto.CommentRequest;
import org.sharestory.project.dto.CommentResponse;
import org.sharestory.project.model.Comment;
import org.sharestory.project.service.CommentService;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
public class CommentsController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Void> createComment(@RequestBody CommentRequest commentRequest) {
        commentService.save(commentRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/by-post/{postId}")
    public ResponseEntity<List<CommentResponse>> getAllCommentsForPost(@PathVariable Long postId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(commentService.getAllCommentsForPost(postId));
    }

    @GetMapping("/by-user/{username}")
    public ResponseEntity<List<CommentResponse>> getAllCommentsForUser(@PathVariable String username){
        return ResponseEntity.status(HttpStatus.OK)
                .body(commentService.getAllCommentsForUser(username));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentById(@PathVariable Long id) {
    	Comment comment = commentService.getCommentById(id);
    	commentService.deleteComment(comment);
    	return new ResponseEntity<>(HttpStatus.OK);
    }
}
