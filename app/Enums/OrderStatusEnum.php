<?php

namespace App\Enums;

enum OrderStatusEnum: string
{
    case INPROGRESS = 'inprogress';
    case CANCELED = 'canceled';
    case COMPLETED = 'completed';
    case DELIVERED = 'delivered';
    case SHIPPED = 'shipped';
    case NEW = 'new';
    case PAID  = 'paid';
    case ACTIVE  = 'active';
    case EXPIRED = 'expired';
    case PENDING  = 'pending';
    case PENDING_PAYMENT  = 'pending_payment';
    case COMPLETED_PAYMENT  = 'completed_payment';
    case APPROVED_PAYMENT = 'approved_payment';
    case PAYMENT_FAILED = 'failed_payment';
}
