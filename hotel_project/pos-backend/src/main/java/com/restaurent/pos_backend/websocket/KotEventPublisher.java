package com.restaurent.pos_backend.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.restaurent.pos_backend.model.KitchenOrderTicket;

@Component
public class KotEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public KotEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishKotCreated(KitchenOrderTicket kot) {
        messagingTemplate.convertAndSend("/topic/kots", kot);
    }

    public void publishKotUpdated(KitchenOrderTicket kot) {
        messagingTemplate.convertAndSend("/topic/kots/update", kot);
    }
}