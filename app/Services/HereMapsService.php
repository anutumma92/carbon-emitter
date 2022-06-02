<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class HereMapsService
{

    public function calculateRoute()
    {
        $client = new Client();
        $res = $client->request('GET', 'https://api.github.com/user', [
            'auth' => ['user', 'pass']
        ]);
        echo $res->getStatusCode();
        echo $res->getHeader('content-type')[0];
        echo $res->getBody();
    }

}