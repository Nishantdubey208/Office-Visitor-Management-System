package com.vms.service;

import com.vms.dto.DashboardStatsDTO;
import com.vms.dto.VisitorRequestDTO;
import com.vms.dto.VisitorResponseDTO;

import java.util.List;

/**
 * Service interface defining the business operations for Visitor Management.
 * Demonstrates Abstraction in Java OOP.
 */
public interface VisitorService {

    /**
     * Registers a new visitor, generates a unique Visitor ID, and stores the record with 'Checked In' status.
     *
     * @param request Visitor registration details
     * @return Created visitor response DTO
     */
    VisitorResponseDTO registerVisitor(VisitorRequestDTO request);

    /**
     * Retrieves all visitor records sorted by registration time descending.
     *
     * @return List of all visitors
     */
    List<VisitorResponseDTO> getAllVisitors();

    /**
     * Finds a visitor by their primary key database ID.
     *
     * @param id Database ID
     * @return Visitor response DTO
     */
    VisitorResponseDTO getVisitorById(Long id);

    /**
     * Finds a visitor by their unique generated Visitor ID (e.g., VMS-1001).
     *
     * @param visitorId Formatted visitor ID
     * @return Visitor response DTO
     */
    VisitorResponseDTO getVisitorByVisitorId(String visitorId);

    /**
     * Searches visitors by visitor name or 10-digit mobile number.
     *
     * @param keyword Search query
     * @return Matching visitors list
     */
    List<VisitorResponseDTO> searchVisitors(String keyword);

    /**
     * Checks out a visitor by setting status to 'Checked Out' and recording the checkout timestamp.
     *
     * @param id Visitor ID to check out
     * @return Updated visitor response DTO
     */
    VisitorResponseDTO checkOutVisitor(Long id);

    /**
     * Checks in a visitor by setting status to 'Checked In' and clearing checkout timestamp.
     *
     * @param id Visitor ID to check in
     * @return Updated visitor response DTO
     */
    VisitorResponseDTO checkInVisitor(Long id);

    /**
     * Updates an existing visitor's personal details and visit schedule.
     *
     * @param id Visitor numeric database ID
     * @param request Updated visitor details
     * @return Updated visitor response DTO
     */
    VisitorResponseDTO updateVisitor(Long id, VisitorRequestDTO request);

    /**
     * Permanently deletes a visitor record from the MySQL database.
     *
     * @param id Visitor ID to delete
     */
    void deleteVisitor(Long id);

    /**
     * Computes live dashboard statistics: Total Visitors, Checked In, and Checked Out.
     *
     * @return Live dashboard statistics DTO
     */
    DashboardStatsDTO getDashboardStats();
}
