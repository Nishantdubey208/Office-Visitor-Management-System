package com.vms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Entity class representing a Visitor in the Office Visitor Management System.
 * Demonstrates OOP concepts including Encapsulation and JPA Relational Mapping.
 */
@Entity
@Table(name = "visitors", indexes = {
    @Index(name = "idx_vms_mobile", columnList = "mobile_number"),
    @Index(name = "idx_vms_name", columnList = "visitor_name"),
    @Index(name = "idx_vms_status", columnList = "status")
})
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visitor_id", nullable = false, unique = true, length = 30)
    private String visitorId;

    @Column(name = "visitor_name", nullable = false, length = 100)
    private String visitorName;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "person_to_visit", nullable = false, length = 50)
    private String personToVisit;

    @Column(name = "purpose", nullable = false, length = 50)
    private String purpose;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "visit_time", nullable = false)
    private LocalTime visitTime;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "Checked In";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "checkout_time")
    private LocalDateTime checkoutTime;

    // Default No-Args Constructor (Required by JPA)
    public Visitor() {
    }

    // Parameterized Constructor
    public Visitor(String visitorId, String visitorName, String mobileNumber, String email,
                   String personToVisit, String purpose, LocalDate visitDate, LocalTime visitTime,
                   String status) {
        this.visitorId = visitorId;
        this.visitorName = visitorName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.personToVisit = personToVisit;
        this.purpose = purpose;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
        this.status = status != null ? status : "Checked In";
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.trim().isEmpty()) {
            this.status = "Checked In";
        }
    }

    // --- Getters and Setters (Encapsulation) ---

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

    @Override
    public String toString() {
        return "Visitor{" +
                "id=" + id +
                ", visitorId='" + visitorId + '\'' +
                ", visitorName='" + visitorName + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", personToVisit='" + personToVisit + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
