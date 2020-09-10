<?php
declare(strict_types=1);
namespace Kabeers;
//require 'small-http.php';

use Error;
use Exception;

session_start();

class KAuth
{
    public $tokens = null;
    private $client_secret = null;
    private $client_public = null;
    private $save_dir = null;
    private $auth_uri = null;
    private $endPoints = array(
        'UserInfo' => 'http://kabeers-auth.herokuapp.com/user/userinfo',
        'AccessToken' => 'http://kabeers-auth.herokuapp.com/auth/token',
        'RefreshToken' => 'http://kabeers-auth.herokuapp.com/auth/refresh'
    );
    private $session_state = false;

    public function getUserInfo(String $token)
    {
        if (!$token || !$this->client_secret || !$this->client_public) return 0;
        return preg_replace("/\s+/", "", SmallHttp::HTTPPost($this->endPoints['UserInfo'],
            array(
                "client_public" => "$this->client_public",
                "client_secret" => "$this->client_secret",
                "token" => "$token"
            )
        ));
    }

    public function init(String $client_public, String $client_secret, String $save_dir, Bool $session_state = false)
    {
        if (!$client_public || !$client_secret || !$save_dir) return 0;
        $this->client_public = $client_public;
        $this->client_secret = $client_secret;
        $this->save_dir = $save_dir;
        if (isset($_GET['code'])) {
            if ($session_state === false) {
                $token_response = json_decode($this->getAccessTokens(htmlspecialchars($_GET['code'])), true);
                if ($token_response !== null && gettype($token_response) === 'array') {
                    for ($i = count($token_response) - 1; $i >= 0; $i--) {
                        foreach ($token_response[$i] as $key => $value) {
                            $this->tokens = $token_response;
                        }
                    }
                } // IF
            } else {
                if ($_GET['state'] !== $_SESSION['kauth_state']) {
                    return 0;
                }
                $token_response = json_decode($this->getAccessTokens(htmlspecialchars($_GET['code'])), true);
                if ($token_response !== null && gettype($token_response) === 'array') {
                    for ($i = count($token_response) - 1; $i >= 0; $i--) {
                        foreach ($token_response[$i] as $key => $value) {
                            $this->tokens = $token_response;
                        }
                    }
                }// IF
            }
        }
        return true;
    }

    public function refreshToken(String $refresh_token)
    {
        if (!$this->client_secret || !$this->client_public || !$refresh_token) return 0;
        $jwt_payload = json_decode(base64_decode(urldecode(explode('.', $refresh_token)[1])));
        if ($jwt_payload->iat > $jwt_payload->exp) {
            throw new Error('Refresh Token Expired');
        }
        return SmallHttp::HTTPPost($this->endPoints['RefreshToken'],
            array(
                "client_public" => "$this->client_public",
                "client_secret" => "$this->client_secret",
                "refresh_token" => "$refresh_token"
            ));
    }

    private function getAccessTokens(String $code)
    {
        if (!$this->client_secret || !$this->client_public || !$code) return 0;
        return SmallHttp::HTTPPost($this->endPoints['AccessToken'],
            array(
                "client_public" => "$this->client_public",
                "client_secret" => "$this->client_secret",
                "auth_code" => "$code"
            ));
    }

    public function saveToken(String $key, String $value)
    {
        if (!$value || !$key) return 0;
        $return = false;
        $key = md5($key);
        if (isset($this->save_dir) && $this->save_dir !== '' || null) {
            $save_key = fopen("$this->save_dir/$key.kauth_store", "w") or die("Unable to open file!");
            fwrite($save_key, "$value");
            fclose($save_key);
            $return = true;
        }
        return $return;
    }

    public function getToken(String $key)
    {
        if (!$key) return 0;
        $return = null;
        $key = md5($key);
        if (isset($this->save_dir) && $this->save_dir !== '' || null) {
            $save_contents = null;
            try {
                $save_contents = file_get_contents("$this->save_dir/$key.kauth_store");
                $return = true;
            } catch (Exception $e) {
                $return = false;
            }
            return $save_contents !== null || '' ? $save_contents : $return;
        }
        return true;
    }

    public function createAuthURI(Array $claims, String $callback, String $state, String $response_type = 'code', String $prompt = 'consent')
    {
        $callback = urlencode($callback);
        $claims = urlencode(join(array_unique($claims), '|'));
        if (!$state) {
            $state = uniqid();
        }
        if (isset($this->session_state)) {
            $_SESSION['kauth_state'] = $state;
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

    public function redirect()
    {
        if (!$this->auth_uri || $this->auth_uri === null) {
            return false;
        }
        header("Location:$this->auth_uri");
        return 0;
    }
}

//----------------------------------------------------------------------


$s = new KAuth();
$s->init('cascb94164a10fa702c09aa0f3e2fd3f8e77a73e', '5s323720194bccb1cb94164a10fa702c09aa0', './', true);
$s->createAuthURI(
    ['p6rouHTvGJJCn9OuUNTZRfuaCnwc6:files', 'AStroWorld_Cn9OuUNTZRfuaCnwc6:username', 'AStroWorld_Cn9OuUNTZRfuaCnwc6:username'],
    'http://localhost/projects/oauth_test/New%20Folder/php_sdk.php',
    uniqid(),
    'code'
);
echo $s->render('5rem', 'auto', 'dark');
//$s->redirect();
if ($s->tokens) {
    foreach ($s->tokens as $k) {
        foreach ($k as $b => $value) {
            if (array_search($value, $k) === 'AStroWorld_Cn9OuUNTZRfuaCnwc6') {
                $info = $k[array_search($value, $k)];
                echo $s->refreshToken($info['refresh_token']);
                echo $s->getUserInfo($info['access_token']);
                $s->saveToken('ii', $info['refresh_token']);
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
