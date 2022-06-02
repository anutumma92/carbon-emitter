<?php

namespace App\Services;

use GuzzleHttp\Client;

class HereMapsService
{
    public string $url;

    public string $app_id;

    public string $app_code;

    public array $alternativesParameters = [
        [
            'mode' => 'fastest;truck',
        ],
        [
            'mode' => 'balanced;truck',
        ]
    ];

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
        $routeAlternatives = $this->getRouteQueryString();
        $responsePerAlternatives = [];

        foreach ($routeAlternatives as $index => $route)
        {
            $client = new Client();
            $res = $client->request('GET', $this->url, [
                'query' => $route
            ]);

            $rawData = json_decode($res->getBody()->getContents(),true);

            $responseData = $this->filterResponse($rawData);
            $responseData = $this->calculateFuel($responseData, '');
            $responseData = $this->calculateMap($responseData, $rawData);

            $responsePerAlternatives[$index] = $responseData;
        }

        return $responsePerAlternatives;
    }

    protected function calculateFuel(array $response, ?string $truckType) : array
    {
        $response['fuel_burned'] = $response['total_distance'] / 12;

        return $response;
    }

    protected function calculateMap(array $response, array $rawData){

        $legs = $rawData['response']['route'][0]['leg'] ?? [];
        $route = [];
        $length = 0;

        foreach ($legs as $leg) {
            if (!isset($leg['length'], $leg['maneuver'])) {
                continue;
            }

            $length += $leg['length'];
            foreach ($leg['maneuver'] as ['shape' => $points]) {
                foreach ($points as $point) {
                    $latLon = explode(',', $point);
                    $route[] = [
                        'lat' => $latLon[0],
                        'lon' => $latLon[1],
                    ];
                }
            }
        }

        $mapUrl = MapUrlService::encode($route);
        $response['map'] = $mapUrl;
        return $response;
    }

    protected function filterResponse(array $response) : array
    {
        return [
            'total_distance' => $response['response']['route'][0]['summary']['distance'] / 1000,
            'travel_time' => $response['response']['route'][0]['summary']['travelTime'],
            'travel_text' => $response['response']['route'][0]['summary']['text'],
        ];
    }

    protected function getRouteQueryString() : array
    {
        $extraFilters = $this->alternativesParameters;

        $alternativeParameters = [];

        foreach ($extraFilters as $index => $filter){
            $alternativeParameters[$index] = [
                'app_id' => $this->app_id,
                'app_code' => $this->app_code,
                'metricSystem' => 'metric',
                'maneuverAttributes' => 'shape',
                'waypoint0' => 'geo!50.8857,14.81589',
                'waypoint1' => 'geo!50.8681536,14.8308207',
            ] + $filter;
        }

        return $alternativeParameters;
    }

}