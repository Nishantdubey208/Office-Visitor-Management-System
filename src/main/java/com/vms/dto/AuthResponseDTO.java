package com.vms.dto;

/**
 * Data Transfer Object for authentication status and admin user profile responses.
 */
public class AuthResponseDTO {

    private boolean authenticated;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private String message;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(boolean authenticated, String username, String fullName, String email, String role, String message) {
        this.authenticated = authenticated;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public static AuthResponseDTO authenticated(String username, String fullName, String email, String role, String message) {
        return new AuthResponseDTO(true, username, fullName, email, role, message);
    }

    public static AuthResponseDTO unauthenticated(String message) {
        return new AuthResponseDTO(false, null, null, null, null, message);
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
