<?php

namespace App\Http\Responses;


class GenericResponse
{
    public static function success($data){

        return response()->setStatusCode(200)
            ->json([
                'success' => true,
                'error' => [],
                'data' => $data
            ]);

    }

    public static function error(\Exception $error)    {

        return response()->setStatusCode(500)
            ->json([
                'success' => false,
                'error' => $error->getMessage(),
                'data' => []
            ]);

    }

}