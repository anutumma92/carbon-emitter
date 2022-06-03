<?php

namespace App\Services;

use GuzzleHttp\Client;

class GeocodeService
{
    public function getCoords($address)
    {

        $queryParams = [
            'address' => $address,
            'key' => 'AIzaSyAohAwtxnzh5uxxyx2SsO9LDKnWHmHC7SQ',
        ];

        $client = new Client();
        $res = $client->request('GET', 'https://maps.googleapis.com/maps/api/geocode/json', [
            'query' => $queryParams
        ]);

        $rawData = json_decode($res->getBody()->getContents(),true);

        if(!empty($rawData['results'][0])){
            return $rawData['results'][0]['geometry']['location'];
        }else{
            throw new \Exception('No valid address found, please try again.');
        }
    }
}