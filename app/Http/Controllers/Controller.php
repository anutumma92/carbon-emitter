<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Controller extends BaseController
{
    /**
     * @OA\Info(
     *   title="COVID-19 Data API",
     *   version="1.0",
     *   description="This is an API that scrape data from https://www.worldometers.info/coronavirus/ and serve the data in JSON format",
     *   @OA\Contact(
     *     email="haniefhan@gmail.com",
     *     name="Developer"
     *   )
     * )
     */
    public function method(Request $request)
    {
        return response('Hallow !');
    }
}
