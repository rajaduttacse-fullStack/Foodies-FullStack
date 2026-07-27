package com.food.foodiesapi.Service;

import com.food.foodiesapi.io.OrderRequest;
import com.food.foodiesapi.io.OrderResponse;
import com.razorpay.RazorpayException;

import java.util.List;
import java.util.Map;

public interface OrderService {

  OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException;
  void verifyPayment(Map<String, String> paymentData , String status );
  List<OrderResponse> getUserOrders(); //it is only for logged-in User
  void removeOrder(String orderId);
  List<OrderResponse> getOrderOfAllUsers() ; //it is for admin to see all the order
  void updateOrderStatus(String orderId , String status);


}
