<?php

namespace App\Http\Controllers;

use App\Http\Responses\GenericResponse;
use App\Services\HereMapsService;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Services\ClimatiqService;

class Routing extends BaseController
{
    public function calculate(Request $request)
    {
        $requestBody = (array) json_decode($request->getContent());

        try {
            $service = new HereMapsService();
            $calculation = $service->calculateRoute();

            $response = [];
            foreach ($calculation as $route) {
                $climatiqService = new ClimatiqService([
                    'emission_factor' => $requestBody['vehicle_type'],
                    'parameters' => [
                        'weight' => $calculation['total_weight'],
                        'weight_unit' => "kg",
                        'distance' => $calculation['total_distance'],
                        'distance_unit' => "km"
                    ]
                ]);
            }

            return GenericResponse::success($response);

        } catch (\Exception $error)
        {
            return GenericResponse::error($error);
        }
    }
}
