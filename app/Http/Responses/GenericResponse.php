<?php

namespace App\Http\Responses;


class GenericResponse
{

    public static function success($data){

        return response([
            'success' => false,
            'error_message' => '',
            'data' => $data
        ]);

    }

    public static function error(\Exception $error)    {

        return response([
                'success' => false,
                'error_message' => $error->getMessage(),
                'data' => []
            ]);

    }

}