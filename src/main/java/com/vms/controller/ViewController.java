package com.vms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller forwarding client-side routes to index.html for Single Page Application navigation.
 * Ensures direct browser URLs and browser refresh work on routes like /visitors, /visitors/register, and /login.
 */
@Controller
public class ViewController {

    @GetMapping(value = {
        "/",
        "/dashboard",
        "/visitors",
        "/visitors/**",
        "/register",
        "/login"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
