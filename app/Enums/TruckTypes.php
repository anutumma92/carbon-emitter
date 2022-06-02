<?php

namespace App\Enums;

abstract class TruckTypes
{
    const CNG_HGV_3T_7T = '3T_7T';
    const CNG_HGV_7T_12T = '7T_12T';
    const CNG_LIGHT_DUTY_TRUCK = 'CNG light-duty truck';

    const TRUCK_TYPES = [
        self::CNG_HGV_3T_7T => [ 'efficiency' =>  9.09091],
        self::CNG_HGV_7T_12T => [ 'efficiency' =>  5],
        self::CNG_LIGHT_DUTY_TRUCK => [ 'efficiency' =>  2.85714],
    ];
}