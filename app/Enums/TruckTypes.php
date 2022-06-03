<?php

namespace App\Enums;

abstract class TruckTypes
{
    const UP_TO_3T = 'freight_vehicle_wtt-vehicle_type_van-fuel_source_diesel-vehicle_weight_1.305t_lt_1.74t';
    const UP_TO_7T = 'freight_vehicle-vehicle_type_hgv_rigid-fuel_source_diesel-vehicle_weight_gt_3.5t_lt_7.5t-percentage_load_100';
    const UP_TO_12T = 'freight_vehicle-vehicle_type_hgv_rigid-fuel_source_diesel-vehicle_weight_gt_17t-percentage_load_100';
    const UP_TO_40T = 'freight_vehicle-vehicle_type_hgv_articulated-fuel_source_diesel-vehicle_weight_gt_33t-percentage_load_10';
    const FRIGO = 'freight_vehicle-vehicle_type_hgv_articulated_refrig-fuel_source_diesel-vehicle_weight_gt_33t-percentage_load_100';

    const TRUCK_EFFICIENCY = [
        self::UP_TO_3T => 9.09,
        self::UP_TO_7T => 5.13,
        self::UP_TO_12T => 4.67,
        self::UP_TO_40T => 2.86,
//        self::FRIGO => 3.3,
    ];
}
