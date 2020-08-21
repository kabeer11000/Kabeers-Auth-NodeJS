<?php
declare(strict_types=1);
namespace Kabeers;
require 'small-http.php';

use Error;
use Exception;

class KAuth
{
    public $tokens = null;
    private $client_secret = null;
    private $client_public = null;
    private $save_dir = null;
    private $auth_uri = null;

    public function getUserInfo($token)
    {
        if (!$token || !$this->client_secret || !$this->client_public) return 0;
        return preg_replace("/\s+/", "", SmallHttp::HTTPPost("http://localhost:3000/user/userinfo",
            array(
                "client_public" => "$this->client_public",
                "client_secret" => "$this->client_secret",
                "token" => "$token"
            )
        ));
    }

    public function init($client_public, $client_secret, $save_dir)
    {
        if (!$client_public || !$client_secret || !$save_dir) return 0;
        $this->client_public = $client_public;
        $this->client_secret = $client_secret;
        $this->save_dir = $save_dir;
        if (isset($_GET['code'])) {
            $token_response = json_decode($this->getAccessTokens($_GET['code']), true);
            if ($token_response !== null && gettype($token_response) === 'array') {
                for ($i = 0;
                     $i < count($token_response);
                     $i++) {
                    foreach ($token_response[$i] as $key => $value) {
                        $this->tokens = $token_response;
                    }
                }
            }
        }
        return true;
    }

    public function refreshToken($refresh_token)
    {
        if (!$this->client_secret || !$this->client_public || !$refresh_token) return 0;
        $jwt_payload = json_decode(base64_decode(urldecode(explode('.', $refresh_token)[1])));
        if ($jwt_payload->iat > $jwt_payload->exp) {
            throw new Error('Refresh Token Expired');
        }
        return SmallHttp::HTTPPost("http://localhost:3000/auth/refresh",
            array(
                "client_public" => "$this->client_public",
                "client_secret" => "$this->client_secret",
                "refresh_token" => "$refresh_token"
            ));

    }

    private function getAccessTokens($code)
    {
        if (!$this->client_secret || !$this->client_public || !$code) return 0;
        return SmallHttp::HTTPPost("http://localhost:3000/auth/token",
            array(
                "client_public" => "$this->client_public",
                "client_secret" => "$this->client_secret",
                "auth_code" => "$code"
            ));
    }

    public function saveToken(String $key, String $value)
    {
        if (!$value || !$key) return 0;
        $r = false;
        $key = md5($key);
        if (isset($this->save_dir) && $this->save_dir !== '' || null) {
            $save_key = fopen("$this->save_dir/$key.kauth_store", "w") or die("Unable to open file!");
            fwrite($save_key, "$value");
            fclose($save_key);
            $r = true;
        }
        return $r;
    }

    public function getToken(String $key)
    {
        if (!$key) return 0;
        $r = null;
        $key = md5($key);
        if (isset($this->save_dir) && $this->save_dir !== '' || null) {
            $save_contents = null;
            try {
                $save_contents = file_get_contents("$this->save_dir/$key.kauth_store");
                $r = true;
            } catch (Exception $e) {
                $r = false;
            }
            return $save_contents !== null || '' ? $save_contents : $r;
        }
        return true;
    }

    public function createAuthURI(Array $claims, String $callback, String $state, String $response_type = 'code', String $prompt = 'consent')
    {
        $callback = urlencode($callback);
        $claims = urlencode(join($claims, '|'));
        if (!$state) {
            $state = uniqid();
        }
        $this->auth_uri = "http://localhost:3000/auth/$this->client_public/$claims/$response_type/$callback/$state/$prompt";
    }

    public function render(String $height, String $width, String $theme = 'dark')
    {
        if (!$height || !$width || !$theme || !$this->auth_uri || $this->auth_uri === null) {
            return false;
        }
        if ($theme === 'dark') {
            return "<div class='kauth_btn--container'><a href='$this->auth_uri' class='kauth_btn--anchor'><img alt='Login With Kabeers Network' class='kauth_btn--image' src='https://cdn.jsdelivr.net/gh/kabeer11000/kauthsdk-php/dist/dark.svg' style='width:$width;height:$height'></a></div>";
        }
        return "<div class='kauth_btn--container'><a href='$this->auth_uri' class='kauth_btn--anchor'><img alt='Login With Kabeers Network' class='kauth_btn--image' src='https://cdn.jsdelivr.net/gh/kabeer11000/kauthsdk-php/dist/light.svg' style='width:$width;height:$height'></a></div>";
    }
}

$s = new KAuth();
$s->init('cascb94164a10fa702c09aa0f3e2fd3f8e77a73e', '5s323720194bccb1cb94164a10fa702c09aa0', './');
$s->createAuthURI(['p6rouHTvGJJCn9OuUNTZRfuaCnwc6:files', 'p6rouHTvGJJCn9OuUNTZRfuaCnwc6:username'], 'http://localhost/projects/oauth_test/New%20Folder/php_sdk.php', uniqid(), 'code');
echo $s->render('5rem', '6rem', 'dark');
if ($s->tokens) {
    foreach ($s->tokens as $k) {
        foreach ($k as $b => $value) {
            if (array_search($value, $k) === 'p6rouHTvGJJCn9OuUNTZRfuaCnwc6') {
                $info = $k[array_search($value, $k)];
                echo $s->refreshToken($info['refresh_token']);
                break;
            }
        }
    }
}
//echo $s->refreshToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaF90b2tlbiIsImFwcF9uYW1lIjoiRGVtbyBBcHAiLCJhcHBfaWQiOiJwNnJvdUhUdkdKSkNuOU91VU5UWlJmdWFDbndjNiIsInNpZ24iOnsiaXYiOiI0ZmVlM2EyOTEyMWE5MTQzYzA0YjIxODBhMGEyNjI0ZiIsImVuY3J5cHRlZERhdGEiOiI0MzdmODk3MTVlZDYzNzNmY2E1NjNiMGZkYjk3NzU2NGRiOWJlMmVhYTIxOTU3YmMzNzc1ZTg1YWZmMDc5YTJlIn0sImdyYW50X3R5cGVzIjoicDZyb3VIVHZHSkpDbjlPdVVOVFpSZnVhQ253YzY6ZmlsZXMiLCJ1c2VyX2lkIjoiYzQwMDAzNzYxMTQxODRiMzhlMmYwMGU0M2IwNzBhOWZlMjM5NDU3ZCIsImlhdCI6MTU5ODAxMTczNCwiZXhwIjoxNTk4ODc1NzM0fQ.BWxR7dwmKSSq21AisVHMvM17DUez-un5k4aWF-SVhjI');


//$s->saveToken('PORn', 'SEX');
//echo $s->getToken('PORn');
/*
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
*/
?>
