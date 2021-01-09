package org.sharestory.project.repository;

import org.sharestory.project.model.Post;
import org.sharestory.project.model.User;
import org.sharestory.project.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findTopByPostAndUserOrderByIdDesc(Post post, User currentUser);
}
