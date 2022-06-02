<?php

namespace App\Http\Controllers;

use App\Http\Responses\GenericResponse;
use App\Services\HereMapsService;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Routing extends BaseController
{
    public function calculate(Request $request)
    {
        try{
            $service = new HereMapsService();
//            $calculation = $service->calculateRoute();
            return GenericResponse::success([]);

        }catch (\Exception $error)
        {
            return GenericResponse::error($error);
        }
    }
}
