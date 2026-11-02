
package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.dto.AuthResponseDTO;
import com.vms.dto.LoginRequestDTO;
import com.vms.entity.AdminUser;
import com.vms.repository.AdminUserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminUserRepository adminUserRepository;
    private final SecurityContextRepository securityContextRepository;

    @Autowired
    public AuthController(
            AuthenticationManager authenticationManager,
            AdminUserRepository adminUserRepository,
            SecurityContextRepository securityContextRepository) {

        this.authenticationManager = authenticationManager;
        this.adminUserRepository = adminUserRepository;
        this.securityContextRepository = securityContextRepository;
    }

    // ADMIN LOGIN
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        try {
            Optional<AdminUser> adminOpt =
                    adminUserRepository.findByUsernameOrEmail(
                            request.getUsernameOrEmail(),
                            request.getUsernameOrEmail()
                    );

            if (adminOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid username/email or password."));
            }

            AdminUser admin = adminOpt.get();

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    admin.getUsername(),
                                    request.getPassword()
                            )
                    );

            // Protect against session fixation
            httpRequest.getSession(true);
            httpRequest.changeSessionId();

            // Create and save security context
            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            securityContextRepository.saveContext(
                    context,
                    httpRequest,
                    httpResponse
            );

            // Update last login
            admin.setLastLogin(LocalDateTime.now());
            adminUserRepository.save(admin);

            AuthResponseDTO authDTO = AuthResponseDTO.authenticated(
                    admin.getUsername(),
                    admin.getFullName() != null
                            ? admin.getFullName()
                            : admin.getUsername(),
                    admin.getEmail(),
                    admin.getRole(),
                    "Authentication successful"
            );

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Login successful. Welcome back!",
                            authDTO
                    )
            );

        } catch (BadCredentialsException ex) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(
                            "Invalid username/email or password."
                    ));

        } catch (Exception ex) {

            // Development debugging only
            ex.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(
                            "Authentication failed. Please try again."
                    ));
        }
    }

    // CHECK AUTHENTICATION STATUS
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> getAuthStatus() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth != null
                && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal())) {

            String username = auth.getName();

            Optional<AdminUser> adminOpt =
                    adminUserRepository.findByUsername(username);

            if (adminOpt.isPresent()) {

                AdminUser admin = adminOpt.get();

                AuthResponseDTO authDTO = AuthResponseDTO.authenticated(
                        admin.getUsername(),
                        admin.getFullName() != null
                                ? admin.getFullName()
                                : admin.getUsername(),
                        admin.getEmail(),
                        admin.getRole(),
                        "User is authenticated"
                );

                return ResponseEntity.ok(
                        ApiResponse.success("Session active", authDTO)
                );
            }
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "No active session",
                        AuthResponseDTO.unauthenticated("Not signed in")
                )
        );
    }

    // ADMIN LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "You have been logged out successfully.",
                        "LOGGED_OUT"
                )
        );
    }
}
