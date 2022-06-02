<?php

namespace App\Services;


class MapUrlService
{

    public static function encode($route)
    {
        $str = '';
        $lastLat = 0;
        $lastLng = 0;

        foreach ($route as $point) {
            $x = floor($point['lat'] * 1e5);
            $str .= self::encodeNumber($x - $lastLat);
            $lastLat = $x;
            $x = floor($point['lon'] * 1e5);
            $str .= self::encodeNumber($x - $lastLng);
            $lastLng = $x;
        }

        return $str;
    }

    /**
     * @param int $number
     * @returns string
     */
    protected static function encodeNumber($number)
    {
        $str = '';
        $number = $number << 1;

        if ($number < 0) {
            $number = ~$number;
        }

        while ($number >= 0x20) {
            $nextValue = (0x20 | ($number & 0x1f)) + 63;
            $str .= chr($nextValue);
            $number >>= 5;
        }

        $number += 63;
        $str .= chr($number);

        return $str;
    }
}