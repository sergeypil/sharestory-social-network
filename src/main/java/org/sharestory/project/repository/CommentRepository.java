package org.sharestory.project.repository;

import org.sharestory.project.model.Comment;
import org.sharestory.project.model.Post;
import org.sharestory.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
    List<Comment> findAllByUser(User user);
}
