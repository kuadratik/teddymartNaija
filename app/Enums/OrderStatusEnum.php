<?php

namespace App\Enums;

enum OrderStatusEnum : string
{
    case INPROGRESS = 'inprogress';
    case CANCELED = 'canceled';
    case COMPLETED ='completed';
    case INCART  = 'pending';
    case PENDING  = 'pending';
}
