package com.food.foodiesapi.Service;

import com.food.foodiesapi.entity.OrderEntity;
import com.food.foodiesapi.io.OrderRequest;
import com.food.foodiesapi.io.OrderResponse;
import com.food.foodiesapi.repository.CartRepository;
import com.food.foodiesapi.repository.OrderRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service

public class OrderServiceImpl implements  OrderService{
    @Autowired
    private CartRepository cartRepository ;
    @Autowired
    private  OrderRepository orderRepository ;
    @Autowired
    private  UserService userService ;
    @Value("${razorpay_key}")
    private String RAZORPAY_KEY ;
    @Value("${razorpay_secret}")
    private String RAZORPAY_SECRET ;
    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException {
      OrderEntity newOrder = convertToEntity(request);
      newOrder = orderRepository.save(newOrder);

     //create Razorpay payment Order
        RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY , RAZORPAY_SECRET);
        JSONObject orderRequest = new JSONObject();
        long amountInPaise = Math.round(newOrder.getAmount() * 100);
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency" , "INR");
        orderRequest.put("payment_capture" ,1);

        Order razorpayOrder =  razorpayClient.orders.create(orderRequest);
        newOrder.setRazorpayOrderId(razorpayOrder.get("id"));
        String loggedInUserId =  userService.findByUserId();
        newOrder.setUserId(loggedInUserId);
        newOrder = orderRepository.save(newOrder);
       return convertToResponse(newOrder);


    }

    @Override
    public void verifyPayment(Map<String, String> paymentData, String status) {
       String razorPayOrderId  =  paymentData.get("razorpay_order_id");
      OrderEntity existingOrder  =  orderRepository.findByRazorpayOrderId(razorPayOrderId)
               .orElseThrow(() -> new RuntimeException("Order not found"));
       existingOrder.setPaymentStatus(status);
       existingOrder.setRazorpaySignature(paymentData.get("razorpay_signature"));
       existingOrder.setRazorpayPaymentId(paymentData.get("razorpay_payment_id"));
       orderRepository.save(existingOrder);
       if("paid".equalsIgnoreCase(status)){
           cartRepository.deleteByUserId(existingOrder.getUserId());
       }
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
       List<OrderEntity> list  = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(entity->convertToResponse(entity)).toList();

    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrderOfAllUsers() {
        List<OrderEntity> list =  orderRepository.findAll();
        return list.stream().map(entity -> convertToResponse(entity)).toList() ;
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
     OrderEntity entity =   orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
       return OrderResponse.builder()
                .id(newOrder.getId())
                .amount(newOrder.getAmount())
                .userAddress(newOrder.getUserAddress())
                .userId(newOrder.getUserId())
                .razorpayOrderId(newOrder.getRazorpayOrderId())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderedItems())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
      return  OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .build() ;
    }
}
