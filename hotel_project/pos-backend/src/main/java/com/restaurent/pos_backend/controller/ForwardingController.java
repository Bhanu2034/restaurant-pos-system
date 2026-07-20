package com.restaurent.pos_backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardingController {

    // List all of your React frontend routes here
    @RequestMapping({
        "/login", 
        "/dashboard", 
        "/tables", 
        "/takeaway", 
        "/kitchen", 
        "/billing", 
        "/inventory", 
        "/menu"
    })
    public String forwardToReact() {
        // Forwards the request to the React index.html
        return "forward:/index.html";
    }
}