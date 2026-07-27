package com.food.foodiesapi.controller;


import com.food.foodiesapi.Service.OrderService;
import com.food.foodiesapi.io.OrderRequest;
import com.food.foodiesapi.io.OrderResponse;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService ;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) throws RazorpayException {
        System.out.println("🔥 CREATE ORDER CONTROLLER HIT");
       OrderResponse response = orderService.createOrderWithPayment(request);
        System.out.println("🔥 ORDER CREATED SUCCESSFULLY");
       return response ;

    }
    @PostMapping("/verify")
    public  void verifyPayment(@RequestBody Map<String , String> paymentData){
    orderService.verifyPayment(paymentData , "paid");
    }

    @GetMapping
    public List<OrderResponse> getOrders(){
      return  orderService.getUserOrders();
    }
    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId ){
        orderService.removeOrder(orderId);

    }
   //admin-Panel
    @GetMapping("/all")
    public List<OrderResponse> getOrderOfAllUsers(){
        return orderService.getOrderOfAllUsers();
    }
    //admin-panel
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId , @RequestParam String status){
        orderService.updateOrderStatus(orderId , status);

    }
}
