package com.vms.exception;

/**
 * Exception thrown when a client request fails business or operational validation.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
