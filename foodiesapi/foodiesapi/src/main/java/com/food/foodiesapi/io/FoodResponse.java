package com.food.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponse {

    private String Id ;
    private String name  ;
    private String description ;
    private String imageUrl ;
    private double price ;
    private String category ;

}
