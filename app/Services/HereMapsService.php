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
            'waypoint0' => 'geo!50.8857,14.81589',
            'waypoint1' => 'geo!50.8681536,14.8308207',
            'metricSystem' => 'metric',
            'maneuverAttributes' => 'shape',
        ],
        [
            'mode' => 'fastest;truck',
            'waypoint0' => 'geo!50.8857,14.81589',
            'waypoint1' => 'geo!50.8681536,14.8308207',
            'metricSystem' => 'metric',
            'maneuverAttributes' => 'shape',
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

            $responseData = json_decode($res->getBody()->getContents(),true);
            $responseData = $this->filterResponse($responseData);

            $responsePerAlternatives[$index] = $responseData;
        }

        return $responsePerAlternatives;
    }

    protected function filterResponse(array $response) : array
    {
        return [
            'total_distance' => $response['response']['route'][0]['summary']['distance'],
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
                'app_code' => $this->app_code
            ] + $filter;
        }

        return $alternativeParameters;
    }

}