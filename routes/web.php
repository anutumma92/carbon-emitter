<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return response()->json([ 'version' => $router->app->version()]);
});

$router->get('/key', function() {
    return \Illuminate\Support\Str::random(32);
});

//$router->group(['middleware' => 'cors', 'prefix' => 'admin'], function () use ($router) {
//
//    $router->get('/', function ()    {
//        return response('Under cors');
//    });
//});


$router->get('/route/calculate','\App\Http\Controllers\Routing@calculate');

$router->group(['prefix' => 'crud'], function () use ($router) {
    $router->get('/','\App\Http\Controllers\Controller@method');
});

