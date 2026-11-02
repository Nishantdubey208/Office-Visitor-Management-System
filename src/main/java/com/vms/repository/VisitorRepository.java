package com.vms.repository;

import com.vms.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Visitor entity.
 * Provides abstraction over data persistence and custom parameterized queries.
 */
@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    /**
     * Finds a visitor by their unique generated Visitor ID (e.g. VMS-1001).
     */
    Optional<Visitor> findByVisitorId(String visitorId);

    /**
     * Checks if a visitor with the given generated Visitor ID exists.
     */
    boolean existsByVisitorId(String visitorId);

    /**
     * Returns all visitors sorted chronologically with most recent first.
     */
    List<Visitor> findAllByOrderByCreatedAtDesc();

    /**
     * Searches visitors by visitor name or mobile number (case-insensitive parameterized query).
     */
    @Query("SELECT v FROM Visitor v WHERE " +
           "LOWER(v.visitorName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "v.mobileNumber LIKE CONCAT('%', :keyword, '%') " +
           "ORDER BY v.createdAt DESC")
    List<Visitor> searchVisitors(@Param("keyword") String keyword);

    /**
     * Counts visitors by status (e.g., 'Checked In' or 'Checked Out').
     */
    long countByStatusIgnoreCase(String status);

    /**
     * Retrieves the maximum primary key id currently assigned.
     */
    @Query("SELECT COALESCE(MAX(v.id), 0) FROM Visitor v")
    Long findMaxId();
}
