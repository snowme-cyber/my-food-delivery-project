package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.request.OrderCreateRequest;
import com.example.fooddelivery.dto.response.OrderResponse;
import com.example.fooddelivery.entity.*;
import com.example.fooddelivery.mapper.OrderMapper;
import com.example.fooddelivery.repository.DishRepository;
import com.example.fooddelivery.repository.OrderRepository;
import com.example.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DishRepository dishRepository;
    private final OrderMapper orderMapper;

   @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .address(request.getAddress())
                .status(OrderStatus.CREATED)
                .items(new ArrayList<>())
                .totalPrice(BigDecimal.ZERO)
                .deliveryMethod(request.getDeliveryMethod() != null ? request.getDeliveryMethod() : DeliveryMethod.COURIER)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CARD)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderCreateRequest.OrderItemRequest itemRequest : request.getItems()) {
            Dish dish = dishRepository.findById(itemRequest.getDishId())
                    .orElseThrow(() -> new RuntimeException("Блюдо не найдено"));

            // --- НОВАЯ ЗАЩИТА ---
            if (!dish.getIsAvailable()) {
                throw new RuntimeException("К сожалению, блюдо '" + dish.getName() + "' закончилось и недоступно для заказа.");
            }
            // --------------------

            if (itemRequest.getQuantity() <= 0) {
                throw new RuntimeException("Некорректное количество для блюда: " + dish.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .dish(dish)
                    .quantity(itemRequest.getQuantity())
                    .priceAtPurchase(dish.getPrice())
                    .comment(itemRequest.getComment())
                    .build();

            order.getItems().add(orderItem);

            BigDecimal itemTotal = dish.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            total = total.add(itemTotal);
        }

        order.setTotalPrice(total);
        Order savedOrder = orderRepository.save(order);

        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(orderMapper::toResponse)
                .toList();
    }

@Transactional
    public OrderResponse changeStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        if (newStatus == OrderStatus.COOKING) {
            boolean isPaid = order.getStatus() == OrderStatus.PAID;
            boolean isCash = order.getPaymentMethod() == PaymentMethod.CASH;
            
            if (!isPaid && !isCash) {
                throw new RuntimeException("Нельзя готовить: заказ картой еще не оплачен!");
            }
        }

        if (newStatus == OrderStatus.DELIVERING && order.getStatus() != OrderStatus.COOKING) {
            throw new RuntimeException("Нельзя отправить в доставку: блюда еще не готовы!");
        }

        order.setStatus(newStatus);
        return orderMapper.toResponse(orderRepository.save(order));
    }


    @Transactional
    public OrderResponse cancelOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Вы не можете отменить чужой заказ");
        }

        if (order.getStatus() != OrderStatus.CREATED) {
            throw new RuntimeException("Заказ уже принят в работу, отмена невозможна");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse payOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        if (order.getStatus() != OrderStatus.CREATED) {
            throw new RuntimeException("Оплатить можно только созданный заказ");
        }

        order.setStatus(OrderStatus.PAID); 

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse restoreOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Это не ваш заказ");
        }
        
        order.setStatus(OrderStatus.CREATED);
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public void deleteOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Это не ваш заказ");
        }
        
        orderRepository.delete(order);
    }

    @Transactional
    public void resetAllOrders() {
        orderRepository.deleteAll();
    }

}
