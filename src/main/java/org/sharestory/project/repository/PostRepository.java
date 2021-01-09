package org.sharestory.project.repository;

import org.sharestory.project.model.Post;
import org.sharestory.project.model.Topic;
import org.sharestory.project.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByTopic(Topic topic, Pageable pageable);
    Page<Post> findByUser(User user, Pageable pageable);
    Page<Post> findByPostNameContaining(String postName, Pageable pageable);
}
