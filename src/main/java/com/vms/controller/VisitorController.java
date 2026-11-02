package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.dto.DashboardStatsDTO;
import com.vms.dto.VisitorRequestDTO;
import com.vms.dto.VisitorResponseDTO;
import com.vms.service.VisitorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing visitor management endpoints for frontend Fetch integration.
 */
@RestController
@RequestMapping("/api/visitors")
public class VisitorController {

    private final VisitorService visitorService;

    @Autowired
    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    /**
     * POST /api/visitors - Register a new visitor
     */
    @PostMapping
    public ResponseEntity<ApiResponse<VisitorResponseDTO>> registerVisitor(
            @Valid @RequestBody VisitorRequestDTO request) {
        VisitorResponseDTO created = visitorService.registerVisitor(request);
        return new ResponseEntity<>(
                ApiResponse.success("Visitor registered successfully with ID: " + created.getVisitorId(), created),
                HttpStatus.CREATED
        );
    }

    /**
     * GET /api/visitors - Retrieve all visitor records
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<VisitorResponseDTO>>> getAllVisitors() {
        List<VisitorResponseDTO> visitors = visitorService.getAllVisitors();
        return ResponseEntity.ok(ApiResponse.success("Visitors retrieved successfully", visitors));
    }

    /**
     * GET /api/visitors/{id} - Retrieve single visitor by numeric database ID
     */
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<ApiResponse<VisitorResponseDTO>> getVisitorById(@PathVariable Long id) {
        VisitorResponseDTO visitor = visitorService.getVisitorById(id);
        return ResponseEntity.ok(ApiResponse.success("Visitor found", visitor));
    }

    /**
     * PUT /api/visitors/{id} - Update visitor details
     */
    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<ApiResponse<VisitorResponseDTO>> updateVisitor(
            @PathVariable Long id,
            @Valid @RequestBody VisitorRequestDTO request) {
        VisitorResponseDTO updated = visitorService.updateVisitor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Visitor details updated successfully", updated));
    }

    /**
     * GET /api/visitors/search?keyword=... (or ?query=...) - Search visitors
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<VisitorResponseDTO>>> searchVisitors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String query) {
        String effectiveKeyword = keyword != null ? keyword : query;
        List<VisitorResponseDTO> results = visitorService.searchVisitors(effectiveKeyword);
        return ResponseEntity.ok(ApiResponse.success("Search completed", results));
    }

    /**
     * PUT /api/visitors/{id}/checkout - Mark visitor as Checked Out
     */
    @PutMapping("/{id:[0-9]+}/checkout")
    public ResponseEntity<ApiResponse<VisitorResponseDTO>> checkOutVisitor(@PathVariable Long id) {
        VisitorResponseDTO updated = visitorService.checkOutVisitor(id);
        return ResponseEntity.ok(
                ApiResponse.success("Visitor " + updated.getVisitorId() + " (" + updated.getVisitorName() + ") checked out successfully", updated)
        );
    }

    /**
     * PUT /api/visitors/{id}/checkin - Mark visitor as Checked In
     */
    @PutMapping("/{id:[0-9]+}/checkin")
    public ResponseEntity<ApiResponse<VisitorResponseDTO>> checkInVisitor(@PathVariable Long id) {
        VisitorResponseDTO updated = visitorService.checkInVisitor(id);
        return ResponseEntity.ok(
                ApiResponse.success("Visitor " + updated.getVisitorId() + " (" + updated.getVisitorName() + ") checked in successfully", updated)
        );
    }

    /**
     * DELETE /api/visitors/{id} - Permanently delete visitor record
     */
    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<ApiResponse<Void>> deleteVisitor(@PathVariable Long id) {
        visitorService.deleteVisitor(id);
        return ResponseEntity.ok(ApiResponse.success("Visitor record deleted successfully", null));
    }

    /**
     * GET /api/visitors/stats or /api/visitors/stats/dashboard - Get live dashboard statistics
     */
    @GetMapping(value = {"/stats", "/stats/dashboard", "/dashboard-stats"})
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = visitorService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved", stats));
    }
}
