package com.vms.service.impl;

import com.vms.dto.DashboardStatsDTO;
import com.vms.dto.VisitorRequestDTO;
import com.vms.dto.VisitorResponseDTO;
import com.vms.entity.Visitor;
import com.vms.exception.BadRequestException;
import com.vms.exception.ResourceNotFoundException;
import com.vms.repository.VisitorRepository;
import com.vms.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Visitor business logic and database persistence.
 * Demonstrates OOP Polymorphism and Encapsulation.
 */
@Service
@Transactional
public class VisitorServiceImpl implements VisitorService {

    private final VisitorRepository visitorRepository;

    @Autowired
    public VisitorServiceImpl(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    @Override
    public VisitorResponseDTO registerVisitor(VisitorRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("Visitor registration request cannot be null");
        }

        // Generate unique Visitor ID (e.g. VMS-1001)
        String generatedVisitorId = generateUniqueVisitorId();

        Visitor visitor = new Visitor();
        visitor.setVisitorId(generatedVisitorId);
        visitor.setVisitorName(request.getVisitorName().trim());
        visitor.setMobileNumber(request.getMobileNumber().trim());
        visitor.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() 
                ? request.getEmail().trim() : null);
        visitor.setPersonToVisit(request.getPersonToVisit().trim());
        visitor.setPurpose(request.getPurpose().trim());
        visitor.setVisitDate(request.getVisitDate());
        visitor.setVisitTime(request.getVisitTime());
        visitor.setStatus("Checked In");
        visitor.setCreatedAt(LocalDateTime.now());
        visitor.setCheckoutTime(null);

        Visitor savedVisitor = visitorRepository.save(visitor);
        return mapToResponseDTO(savedVisitor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitorResponseDTO> getAllVisitors() {
        return visitorRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VisitorResponseDTO getVisitorById(Long id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor", "id", id));
        return mapToResponseDTO(visitor);
    }

    @Override
    @Transactional(readOnly = true)
    public VisitorResponseDTO getVisitorByVisitorId(String visitorId) {
        Visitor visitor = visitorRepository.findByVisitorId(visitorId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor", "visitorId", visitorId));
        return mapToResponseDTO(visitor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitorResponseDTO> searchVisitors(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllVisitors();
        }
        return visitorRepository.searchVisitors(keyword.trim())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VisitorResponseDTO checkOutVisitor(Long id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor", "id", id));

        if ("Checked Out".equalsIgnoreCase(visitor.getStatus())) {
            throw new BadRequestException("Visitor " + visitor.getVisitorId() + " (" + visitor.getVisitorName() + ") is already checked out.");
        }

        visitor.setStatus("Checked Out");
        visitor.setCheckoutTime(LocalDateTime.now());

        Visitor updatedVisitor = visitorRepository.save(visitor);
        return mapToResponseDTO(updatedVisitor);
    }

    @Override
    public VisitorResponseDTO checkInVisitor(Long id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor", "id", id));

        if ("Checked In".equalsIgnoreCase(visitor.getStatus())) {
            throw new BadRequestException("Visitor " + visitor.getVisitorId() + " (" + visitor.getVisitorName() + ") is already checked in.");
        }

        visitor.setStatus("Checked In");
        visitor.setCheckoutTime(null);

        Visitor updatedVisitor = visitorRepository.save(visitor);
        return mapToResponseDTO(updatedVisitor);
    }

    @Override
    public VisitorResponseDTO updateVisitor(Long id, VisitorRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("Visitor update request cannot be null");
        }
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor", "id", id));

        visitor.setVisitorName(request.getVisitorName().trim());
        visitor.setMobileNumber(request.getMobileNumber().trim());
        visitor.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty()
                ? request.getEmail().trim() : null);
        visitor.setPersonToVisit(request.getPersonToVisit().trim());
        visitor.setPurpose(request.getPurpose().trim());
        if (request.getVisitDate() != null) {
            visitor.setVisitDate(request.getVisitDate());
        }
        if (request.getVisitTime() != null) {
            visitor.setVisitTime(request.getVisitTime());
        }

        Visitor updated = visitorRepository.save(visitor);
        return mapToResponseDTO(updated);
    }

    @Override
    public void deleteVisitor(Long id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor", "id", id));
        visitorRepository.delete(visitor);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long total = visitorRepository.count();
        long checkedIn = visitorRepository.countByStatusIgnoreCase("Checked In");
        long checkedOut = visitorRepository.countByStatusIgnoreCase("Checked Out");
        return new DashboardStatsDTO(total, checkedIn, checkedOut);
    }

    /**
     * Generates a unique, non-colliding formatted Visitor ID (e.g., VMS-1001, VMS-1002).
     */
    private synchronized String generateUniqueVisitorId() {
        Long maxId = visitorRepository.findMaxId();
        long candidateNumber = (maxId != null ? maxId : 0) + 1;
        String candidateId = "VMS-" + (1000 + candidateNumber);

        while (visitorRepository.existsByVisitorId(candidateId)) {
            candidateNumber++;
            candidateId = "VMS-" + (1000 + candidateNumber);
        }

        return candidateId;
    }

    /**
     * Maps Visitor Entity to VisitorResponseDTO (encapsulating internal entity details).
     */
    private VisitorResponseDTO mapToResponseDTO(Visitor entity) {
        return new VisitorResponseDTO(
                entity.getId(),
                entity.getVisitorId(),
                entity.getVisitorName(),
                entity.getMobileNumber(),
                entity.getEmail(),
                entity.getPersonToVisit(),
                entity.getPurpose(),
                entity.getVisitDate(),
                entity.getVisitTime(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getCheckoutTime()
        );
    }
}
