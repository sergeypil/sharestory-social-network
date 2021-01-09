package org.sharestory.project.service;

import org.ocpsoft.prettytime.PrettyTime;
import org.sharestory.project.dto.PostRequest;
import org.sharestory.project.dto.PostResponse;
import org.sharestory.project.exceptions.PostNotFoundException;
import org.sharestory.project.exceptions.TopicNotFoundException;
import org.sharestory.project.model.Post;
import org.sharestory.project.model.Topic;
import org.sharestory.project.model.User;
import org.sharestory.project.model.Vote;
import org.sharestory.project.model.VoteType;
import org.sharestory.project.repository.CommentRepository;
import org.sharestory.project.repository.PostRepository;
import org.sharestory.project.repository.TopicRepository;
import org.sharestory.project.repository.UserRepository;
import org.sharestory.project.repository.VoteRepository;

import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.Instant;

@Service
@AllArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final VoteRepository voteRepository;
    private final AuthService authService;

    @Transactional
    public void save(PostRequest postRequest) {
        Topic topic = topicRepository.findByName(postRequest.getTopicName())
                .orElseThrow(() -> new TopicNotFoundException(postRequest.getTopicName()));
        postRepository.save(mapToPost(postRequest, topic, authService.getCurrentUser()));
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id.toString()));
        return mapToResponse(post);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPost(String name, int page, int size, String[] sort) {
    	List<Order> orders = new ArrayList<Order>();
        if (sort[0].contains(",")) {
          for (String sortOrder : sort) {
            String[] _sort = sortOrder.split(",");
            orders.add(new Order(getSortDirection(_sort[1]), _sort[0]));
          }
        } else {
          // sort=[field, direction]
          orders.add(new Order(getSortDirection(sort[1]), sort[0]));
        }
        Pageable pagingSort = PageRequest.of(page, size, Sort.by(orders));
        if (name == null)
            return postRepository.findAll(pagingSort).map(this::mapToResponse);
         else
        	return postRepository.findByPostNameContaining(name, pagingSort).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getPostsByTopic(Integer page, String subredditName) {
        Topic subreddit = topicRepository.findByName(subredditName)
                .orElseThrow(() -> new TopicNotFoundException(subredditName));
        return postRepository
                .findAllByTopic(subreddit, PageRequest.of(page, 5))
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<PostResponse> getPostsByUsername(String username, Integer page) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return postRepository
                .findByUser(user, PageRequest.of(page, 5))
                .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    private boolean checkVoteType(Post post, VoteType voteType) {
        if(authService.isLoggedIn()) {						
			Optional<Vote> voteForPostForUser = voteRepository.findTopByPostAndUserOrderByIdDesc(post, authService.getCurrentUser());
            return voteForPostForUser.filter(vote -> vote.getVoteType().equals(voteType)).isPresent();
        }
        return false;
    }

    //delete process without @PreAutorize
	/*
	 * public ResponseEntity<String> deleteById(Long id) { Post post =
	 * postRepository.findById(id) .orElseThrow(() -> new
	 * PostNotFoundException(id.toString())); User currentUser =
	 * authService.getCurrentUser(); Optional<Role> roleAdmin
	 * =currentUser.getRoles().stream().filter(role ->
	 * role.getName().equals(ERole.ROLE_ADMIN)).findAny(); if
	 * (post.getUser().equals(currentUser) || roleAdmin.isPresent()) {
	 * postRepository.delete(post); return new ResponseEntity<>(HttpStatus.OK); }
	 * else return new ResponseEntity<>("No rights to delete the post!",
	 * HttpStatus.FORBIDDEN); }
	 */
	
	@Transactional
	@PreAuthorize("hasRole('ROLE_ADMIN') or #post.user.username == principal.username")
	public void deletePost(Post post) {
			postRepository.delete(post);
	}
	
	@Transactional
	@PreAuthorize("hasRole('ROLE_ADMIN') or #post.user.username == principal.username")
	public void update(PostRequest postRequest, Post post) {
		Topic topic = topicRepository.findByName(postRequest.getTopicName())
                .orElseThrow(() -> new TopicNotFoundException(postRequest.getTopicName()));
			postRepository.save(mapToUpdatePost(postRequest, post, topic));
	}

	@Transactional(readOnly = true)
	public Post getPostById(Long id) {
		return postRepository.findById(id)
				.orElseThrow(() -> new PostNotFoundException(id.toString()));
		
	}
	
    private PostResponse mapToResponse(Post post) {
    	return PostResponse.builder()
                .id(post.getId())
                .postName(post.getPostName())
                .description(post.getDescription())
                .username(post.getUser().getUsername())
                .topicName(post.getTopic().getName())
                .voteCount(post.getVoteCount())
                .commentCount(commentRepository.findByPost(post).size())
                .duration(new PrettyTime().format(post.getCreatedDate()))
                .upVote(checkVoteType(post, VoteType.UPVOTE))
                .downVote(checkVoteType(post, VoteType.DOWNVOTE))
                .edited(post.isEdited())
                .build();
    }

    private Post mapToPost(PostRequest postRequest, Topic topic, User user) {
        Post newPost = Post.builder()
                .postName(postRequest.getPostName())
                .description(postRequest.getDescription())
                .edited(false)
                .voteCount(0)
                .user(authService.getCurrentUser())
                .createdDate(Instant.now())
                .topic(topic)
                .build();
        return newPost;
    }
    
    private Post mapToUpdatePost(PostRequest postRequest, Post post, Topic topic) {
		post.setPostName(postRequest.getPostName());
		post.setTopic(topic);
		post.setDescription(postRequest.getDescription());
		post.setEdited(true);
		return post;
	}
	
	private Sort.Direction getSortDirection(String direction) {
	    if (direction.equals("asc")) {
	      return Sort.Direction.ASC;
	    } else if (direction.equals("desc")) {
	      return Sort.Direction.DESC;
	    }
	    return Sort.Direction.ASC;
	  }
}
