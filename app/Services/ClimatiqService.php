<?php

namespace App\Services;

use GuzzleHttp\Client;

class ClimatiqService
{
    /**
     * @var Client
     */
    private $client;

    /**
     * @var array
     */
    private $headers;

    /**
     * @var array
     */
    private $body;

    public function __construct(array $body)
    {
        $this->client = new Client();
        $this->headers = [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '. env('CLIMATIQ_API_KEY')
        ];
        $this->body = $body;
    }

    public function execute()
    {
        $res = $this->client->request('POST', env('CLIMATIQ_URL'), [
            'headers' => $this->headers,
            'body' => json_encode($this->body)
        ]);

        return $res->getBody()->getContents();
    }

}
