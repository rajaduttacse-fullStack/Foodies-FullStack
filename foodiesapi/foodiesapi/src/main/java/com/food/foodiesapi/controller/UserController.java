package com.food.foodiesapi.controller;

import com.food.foodiesapi.Service.UserService;
import com.food.foodiesapi.io.UserRequest;
import com.food.foodiesapi.io.UserResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {
    private final UserService userService ;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){
       return   userService.registerUser(request);

    }
}
