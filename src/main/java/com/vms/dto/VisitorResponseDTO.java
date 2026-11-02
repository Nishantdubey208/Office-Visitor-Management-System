package com.vms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Data Transfer Object for visitor data returned to the frontend.
 */
public class VisitorResponseDTO {

    private Long id;
    private String visitorId;
    private String visitorName;
    private String mobileNumber;
    private String email;
    private String personToVisit;
    private String purpose;
    private LocalDate visitDate;
    private LocalTime visitTime;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime checkoutTime;

    public VisitorResponseDTO() {
    }

    public VisitorResponseDTO(Long id, String visitorId, String visitorName, String mobileNumber,
                              String email, String personToVisit, String purpose, LocalDate visitDate,
                              LocalTime visitTime, String status, LocalDateTime createdAt,
                              LocalDateTime checkoutTime) {
        this.id = id;
        this.visitorId = visitorId;
        this.visitorName = visitorName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.personToVisit = personToVisit;
        this.purpose = purpose;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
        this.status = status;
        this.createdAt = createdAt;
        this.checkoutTime = checkoutTime;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(String visitorId) {
        this.visitorId = visitorId;
    }

    public String getVisitorName() {
        return visitorName;
    }

    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPersonToVisit() {
        return personToVisit;
    }

    public void setPersonToVisit(String personToVisit) {
        this.personToVisit = personToVisit;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public LocalTime getVisitTime() {
        return visitTime;
    }

    public void setVisitTime(LocalTime visitTime) {
        this.visitTime = visitTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCheckoutTime() {
        return checkoutTime;
    }

    public void setCheckoutTime(LocalDateTime checkoutTime) {
        this.checkoutTime = checkoutTime;
    }
}
