<?php

namespace App\Http\Controllers;

use App\Enums\TruckTypes;
use App\Http\Responses\GenericResponse;
use App\Services\GeocodeService;
use App\Services\HereMapsService;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Services\ClimatiqService;

class Routing extends BaseController
{
    public function calculate(Request $request)
    {
        $requestBody = (array) json_decode($request->getContent());

        $startEndCoords = $this->getCoordsForDropPoints($requestBody['pickup'],$requestBody['drop_off']);

        try {
            $service = new HereMapsService();
            $calculation = $service->calculateRoute($startEndCoords);

            $response = [];
            $co2eArray = [];
            foreach ($calculation as $route) {
                $climatiqInfo = $this->getClimatiqInfo($requestBody['vehicle_type'], $requestBody['total_weight'], $route['total_distance']);
                $response[] = $this->getResponsePerRoute($requestBody['vehicle_type'], $route, $climatiqInfo);
                $co2eArray[] = $climatiqInfo['constituent_gases']->co2e_total;
            }

            foreach (array_keys($co2eArray, min($co2eArray)) as $index) {
                $response[$index]['status'] = 'greenest';
            }

            return GenericResponse::success($response);

        } catch (\Exception $error)
        {
            return GenericResponse::error($error);
        }
    }

    private function getCoordsForDropPoints($start, $end)
    {
        $geocoding = new GeocodeService();
        $startCoords = $geocoding->getCoords($start);

        $geocoding = new GeocodeService();
        $endCoords = $geocoding->getCoords($end);

        $coords = ['start' => $startCoords, 'end' => $endCoords];
        return $coords;

    }

    private function getResponsePerRoute($truckId, $route, $climatiqInfo)
    {
        $defaultTruckEfficiency = TruckTypes::TRUCK_EFFICIENCY[TruckTypes::UP_TO_40T];
        $roadFuelConsumption = round($route['total_distance'] / (TruckTypes::TRUCK_EFFICIENCY[$truckId] ?? $defaultTruckEfficiency), 2);

        $co2eDetails = [];
        foreach ($climatiqInfo['constituent_gases'] as $key => $value) {
            $co2eDetails[$key] = $value ? round($value, 3) : null;
        }

        return [
            "total_distance" => round($route['total_distance'],2),
            "route" => $route['route'],
            "co2e" => $co2eDetails,
            "travel_time" => round($route['travel_time'] / 3600,2), //-- After conversion, that will be in hours
            "fuel_consumption" => $roadFuelConsumption,
            "fuel_efficiency" => round(TruckTypes::TRUCK_EFFICIENCY[$truckId] ?? $this->estimateFrigo($route['travel_time'], $route['total_distance'], $roadFuelConsumption), 2),
            "status" => ""
        ];
    }

    private function getClimatiqInfo($vehicle_type, $total_weight, $total_distance)
    {
        $climatiqService = new ClimatiqService([
            'emission_factor' => $vehicle_type,
            'parameters' => [
                'weight' => (float)$total_weight,
                'weight_unit' => "kg",
                'distance' => $total_distance,
                'distance_unit' => "km"
            ]
        ]);

        return $climatiqService->execute();
    }

    private function estimateFrigo($travelTimeSeconds, $totalDistance, $roadFuelConsumption)
    {
        $travelTimeHours = $travelTimeSeconds/3600;

        $efficiencyFactor = 2.675; //Generator consumption
        $generatorDiesel = $efficiencyFactor * $travelTimeHours;

        $totalDiesel = $generatorDiesel + $roadFuelConsumption;

        return $totalDistance / $totalDiesel;

    }
}
