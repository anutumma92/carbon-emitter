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
                $co2eArray[] = $climatiqInfo['co2e'];
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
        return [
            "total_distance" => $route['total_distance'],
            "route" => "",
            "co2e" => [
                "here" => 87.54199999999999,
                "climatic" => $climatiqInfo['co2e'],
            ],
            "travel_time" => 100,
            "fuel_consumption" => TruckTypes::TRUCK_EFFICIENCY[$truckId] * $route['total_distance'],
            "fuel_efficiency" => TruckTypes::TRUCK_EFFICIENCY[$truckId],
            "status" => ""
        ];
    }

    private function getClimatiqInfo($vehicle_type, $total_weight, $total_distance)
    {
        $climatiqService = new ClimatiqService([
            'emission_factor' => $vehicle_type,
            'parameters' => [
                'weight' => $total_weight,
                'weight_unit' => "kg",
                'distance' => $total_distance,
                'distance_unit' => "km"
            ]
        ]);

        return $climatiqService->execute();
    }
}
