package com.food.foodiesapi.Service;

import com.food.foodiesapi.io.UserRequest;
import com.food.foodiesapi.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);
    String findByUserId();
}
