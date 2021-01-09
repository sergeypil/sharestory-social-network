package org.sharestory.project.controller;

import org.sharestory.project.dto.PostRequest;
import org.sharestory.project.dto.PostResponse;
import org.sharestory.project.model.Post;
import org.sharestory.project.service.PostService;
import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<Void> createPost(@RequestBody PostRequest postRequest) {
        postService.save(postRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPost(
    			@RequestParam(required = false) String name,
    	        @RequestParam(defaultValue = "0") int page,
    	        @RequestParam(defaultValue = "5") int size,
    	        @RequestParam(defaultValue = "id,desc") String[] sort) {
        return new ResponseEntity<>(postService.getAllPost(name, page, size, sort), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return new ResponseEntity<>(postService.getPost(id), HttpStatus.OK);
    }

    @GetMapping("/by-topic/{name}")
    public ResponseEntity<Page<PostResponse>> getPostsByTopic(@PathVariable String name, @RequestParam Optional<Integer> page) {
        return new ResponseEntity<>(postService.getPostsByTopic(page.orElse(0), name), HttpStatus.OK);
    }
    
    @GetMapping("/by-user/{username}")
    public ResponseEntity<Page<PostResponse>> getPostsByUsername(@PathVariable("username") String username, @RequestParam Optional<Integer> page) {
        return new ResponseEntity<>(postService.getPostsByUsername(username, page.orElse(0)), HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostById(@PathVariable Long id) {
    	Post post = postService.getPostById(id);
    	postService.deletePost(post);
    	return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<Void> updatePost(@RequestBody PostRequest postRequest) {
        Post post = postService.getPostById(postRequest.getPostId());
        postService.update(postRequest, post);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
