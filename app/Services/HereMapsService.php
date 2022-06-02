<?php

namespace App\Services;

use GuzzleHttp\Client;

class HereMapsService
{
    public string $url;

    public string $app_id;

    public string $app_code;


    public function __construct()
    {
        $this->url = env('HEREMAPS_URL');
        $this->app_id = env('HEREMAPS_ID');
        $this->app_code= env('HEREMAPS_CODE');

    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function calculateRoute()
    {
        $routeInformation = $this->getRouteQueryString();

        $client = new Client();
        $res = $client->request('GET', $this->url, [
            'query' => $routeInformation
        ]);

        return json_decode($res->getBody()->getContents());
    }

    protected function getRouteQueryString() : array
    {
        $extraFilters = [
            'mode' => 'fastest;truck',
            'waypoint0' => 'geo!50.8857,14.81589',
            'waypoint1' => 'geo!50.8681536,14.8308207',
            'metricSystem' => 'metric',
            'maneuverAttributes' => 'shape',
        ];

        return [
            'app_id' => $this->app_id,
            'app_code' => $this->app_code
        ] + $extraFilters;
    }

}