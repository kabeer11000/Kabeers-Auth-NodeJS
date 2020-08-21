<?php
include 'small-http.php';
$response = SmallHttp::HTTPPost("http://localhost/service/foobar.php", array("postParam" => "foobar"));
$json =
    '[
   {
      "p6rouHTvGJJCn9OuUNTZRfuaCnwc6":{
         "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwiYXBwX25hbWUiOiJEZW1vIEFwcCIsImFwcF9pZCI6InA2cm91SFR2R0pKQ245T3VVTlRaUmZ1YUNud2M2IiwiZ3JhbnRfdHlwZXMiOiJwNnJvdUhUdkdKSkNuOU91VU5UWlJmdWFDbndjNjpmaWxlcyIsInVzZXJfaWQiOiJjNDAwMDM3NjExNDE4NGIzOGUyZjAwZTQzYjA3MGE5ZmUyMzk0NTdkIiwiaWF0IjoxNTk3OTg0ODExLCJleHAiOjE1OTc5ODg0MTF9.bV5lnvPOWy4uGWn9dXiqCWM-NRPhw6hGzo5pa_v",
         "refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaF90b2tlbiIsImFwcF9uYW1lIjoiRGVtbyBBcHAiLCJhcHBfaWQiOiJwNnJvdUhUdkdKSkNuOU91VU5UWlJmdWFDbndjNiIsInNpZ24iOnsiaXYiOiI5MDhmYmY0NjA5Yjg3MTA5NWM0ZjFjYTg5MzA2OGRlNCIsImVuY3J5cHRlZERhdGEiOiJlNmViOWU2NzgyMTI2ODFhMTUyYzIxMjgxZjU1OTQxMDhjMTUzNGRiODczNDc0Njc0Njg4NTE2ZWU0YWVhOGI5In0sImdyYW50X3R5cGVzIjoicDZyb3VIVHZHSkpDbjlPdVVOVFp"
      }
   },
   {
      "AStroWorld_Cn9OuUNTZRfuaCnwc6":{
         "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwiYXBwX25hbWUiOiJEZW1vIEFwcCIsImFwcF9pZCI6IkFTdHJvV29ybGRfQ245T3VVTlRaUmZ1YUNud2M2IiwiZ3JhbnRfdHlwZXMiOiJBU3Ryb1dvcmxkX0NuOU91VU5UWlJmdWFDbndjNjphY2NvdW50X2ltYWdlfEFTdHJvV29ybGRfQ245T3VVTlRaUmZ1YUNud2M2OmVtYWlsfEFTdHJvV29ybGRfQ245T3VVTlRaUmZ1YUNud2M2OnVzZXJuYW1lIiwidXNlcl9pZCI6ImM0MDAwMzc2MTE0MTg0YjM4ZTJmMDBl",
         "refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaF90b2tlbiIsImFwcF9uYW1lIjoiRGVtbyBBcHAiLCJhcHBfaWQiOiJBU3Ryb1dvcmxkX0NuOU91VU5UWlJmdWFDbndjNiIsInNpZ24iOnsiaXYiOiI5MDhmYmY0NjA5Yjg3MTA5NWM0ZjFjYTg5MzA2OGRlNCIsImVuY3J5cHRlZERhdGEiOiJkYzg3ZGY5YWEzNDNiNjg4ZDdmM2Y4Mjk2MTMzM2I4YzEwODZlN2M0MGE0ZTBkYWQ0YzY0NmIyZTQ4MzE4YzM0In0sImdyYW50X3R5cGVzIjoiQVN0cm9Xb3JsZF9DbjlPdVVOVFp"
      }
   }
]';
$array = json_decode($json, true);
//print_r(json_encode($array));
for ($i = 0; $i < count($array); $i++) {
    foreach ($array[$i] as $key => $value) {
        //print_r($value['access_token']);
        $keys_ = array_search($value, $array[$i]);
        //print_r(array_search($value, $array[$i]));
        if ($keys_ === 'p6rouHTvGJJCn9OuUNTZRfuaCnwc6') {
            echo $value['access_token'];
        }

        // your code....
    }
    //var_dump($array[$i]);
    //print_r(array_search('tesxt', array_column($array, 'NAME', 'ID')));
    //echo array_search($array[$i], $array);
}
