package com.food.foodiesapi.controller;

import com.food.foodiesapi.Service.FoodService;
import com.food.foodiesapi.io.FoodRequest;
import com.food.foodiesapi.io.FoodResponse;
import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.thirdparty.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin("*")
public class FoodController {
    private final FoodService foodService ;

    @PostMapping
    public FoodResponse addfood(@RequestPart("food") String foodString
                                 , @RequestPart("file")MultipartFile file) throws JsonProcessingException, com.fasterxml.jackson.core.JsonProcessingException {
        ObjectMapper objectMapper  = new ObjectMapper();
        FoodRequest request = null;
        request = objectMapper.readValue(foodString , FoodRequest.class);

        FoodResponse response =  foodService.addFood(request , file) ;
       return response ;
    }
   /* @GetMapping
    public List<FoodResponse> readFoods(){
       return  foodService.readFoods() ;
    }
*/

    @GetMapping
    public Page<FoodResponse> readFoods(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        return foodService.readFoods(pageable);
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable String id){
      return   foodService.readFood(id) ;

    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable String id){
        foodService.deleteFood(id);
    }

}
