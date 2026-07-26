package com.smarttraders.backend.repository;

import com.smarttraders.backend.entity.Role;
import com.smarttraders.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    long countByRole(Role role);

    @Query(value = """
        SELECT u.*, 
               (6371 * acos(
                   cos(radians(:lat)) * cos(radians(u.latitude)) *
                   cos(radians(u.longitude) - radians(:lng)) +
                   sin(radians(:lat)) * sin(radians(u.latitude))
               )) AS distance
        FROM users u
        WHERE u.role = 'TRADER'
          AND u.latitude IS NOT NULL
          AND u.longitude IS NOT NULL
        HAVING (6371 * acos(
                   cos(radians(:lat)) * cos(radians(u.latitude)) *
                   cos(radians(u.longitude) - radians(:lng)) +
                   sin(radians(:lat)) * sin(radians(u.latitude))
               )) <= :radiusKm
        ORDER BY distance ASC
        """, nativeQuery = true)
    List<Object[]> findNearbyTraders(
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radiusKm") Double radiusKm
    );
}