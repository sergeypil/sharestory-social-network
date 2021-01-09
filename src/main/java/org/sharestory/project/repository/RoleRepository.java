package org.sharestory.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.sharestory.project.model.ERole;
import org.sharestory.project.model.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
	Optional<Role> findByName(ERole name);
}
