package com.example.fooddelivery.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {

    private Long id;
    private String username;
    private String email;
    private String phone;
    private String address;
    private String role;
}
