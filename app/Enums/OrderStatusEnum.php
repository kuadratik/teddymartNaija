<?php

namespace App\Enums;

enum OrderStatusEnum: string
{
    case INPROGRESS = 'inprogress';
    case CANCELED = 'canceled';
    case COMPLETED = 'completed';
    case PAID  = 'paid';
    case ACTIVE  = 'active';
    case PENDING  = 'pending';
    case PENDING_PAYMENT  = 'pending_payment';
    case COMPLETED_PAYMENT  = 'completed_payment';
    case APPROVED_PAYMENT = 'approved_payment';
    case PAYMENT_FAILED = 'failed_payment';
}
