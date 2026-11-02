package com.vms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Data Transfer Object for capturing visitor registration input.
 * Provides server-side validation annotations for clean and secure request handling.
 */
public class VisitorRequestDTO {

    @NotBlank(message = "Visitor name is required")
    @Size(min = 2, max = 100, message = "Visitor name must be between 2 and 100 characters")
    private String visitorName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be a valid 10-digit number")
    private String mobileNumber;

    @Email(message = "Invalid email address format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Person to visit is required")
    private String personToVisit;

    @NotBlank(message = "Purpose of visit is required")
    private String purpose;

    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;

    @NotNull(message = "Visit time is required")
    private LocalTime visitTime;

    public VisitorRequestDTO() {
    }

    public VisitorRequestDTO(String visitorName, String mobileNumber, String email,
                             String personToVisit, String purpose, LocalDate visitDate, LocalTime visitTime) {
        this.visitorName = visitorName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.personToVisit = personToVisit;
        this.purpose = purpose;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
    }

    // Getters and Setters

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
}
