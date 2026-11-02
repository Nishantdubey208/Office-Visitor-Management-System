package com.vms.config;

import com.vms.entity.AdminUser;
import com.vms.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Initializes or synchronizes the system administrator account on startup.
 * Uses BCrypt hashing for password storage and reads credentials from environment variables.
 * If the administrator account already exists, synchronizes credentials if an updated password is provided.
 */
@Component
public class AdminDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminDataInitializer.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${vms.admin.username:admin}")
    private String defaultUsername;

    @Value("${vms.admin.password:IP@2026}")
    private String defaultPassword;

    @Value("${vms.admin.email:admin@vms.com}")
    private String defaultEmail;

    @Value("${vms.admin.name:System Administrator}")
    private String defaultFullName;

    @Autowired
    public AdminDataInitializer(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            Optional<AdminUser> existingAdminOpt = adminUserRepository.findByUsername(defaultUsername);

            if (existingAdminOpt.isEmpty()) {
                logger.info("Initializing administrator account: '{}'...", defaultUsername);
                AdminUser admin = new AdminUser();
                admin.setUsername(defaultUsername);
                admin.setPassword(passwordEncoder.encode(defaultPassword));
                admin.setEmail(defaultEmail);
                admin.setFullName(defaultFullName);
                admin.setRole("ROLE_ADMIN");

                adminUserRepository.save(admin);
                logger.info("Administrator account '{}' created successfully.", defaultUsername);
            } else {
                AdminUser admin = existingAdminOpt.get();
                // Synchronize password if configured password differs from existing BCrypt hash
                if (defaultPassword != null && !defaultPassword.trim().isEmpty() 
                        && !passwordEncoder.matches(defaultPassword, admin.getPassword())) {
                    logger.info("Synchronizing password for administrator '{}' from configured environment credentials...", defaultUsername);
                    admin.setPassword(passwordEncoder.encode(defaultPassword));
                    if (defaultEmail != null && !defaultEmail.trim().isEmpty()) {
                        admin.setEmail(defaultEmail);
                    }
                    if (defaultFullName != null && !defaultFullName.trim().isEmpty()) {
                        admin.setFullName(defaultFullName);
                    }
                    adminUserRepository.save(admin);
                    logger.info("Administrator '{}' credentials synchronized successfully.", defaultUsername);
                } else {
                    logger.info("Administrator account '{}' exists and credentials are up to date.", defaultUsername);
                }
            }
        } catch (Exception ex) {
            logger.error("Failed to initialize or synchronize administrator account: {}", ex.getMessage(), ex);
        }
    }
}
