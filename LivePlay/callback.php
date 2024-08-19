<?php
session_start();

$client_id = 'wb27474oevxe4alz4ffm3wcg26kef6';
$client_secret = 'qeaxs2vognultk41g3p8h5dmvwwofy';
$redirect_uri = 'https://game.schoolweb.fr/LivePlay/callback.php';
$redirect_page = isset($_COOKIE['redirect_page']) ? $_COOKIE['redirect_page'] : 'index.php';
echo $redirect_page;
if (isset($_GET['code'])) {
    $code = $_GET['code'];
    
    // Échange du code contre un token
    $token_url = "https://id.twitch.tv/oauth2/token";
    $fields = [
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'code' => $code,
        'grant_type' => 'authorization_code',
        'redirect_uri' => $redirect_uri,
    ];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $token_url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($fields));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    curl_close($curl);

    $data = json_decode($response, true);
    $_SESSION['access_token'] = $data['access_token'];
    setcookie('access_token', $data['access_token'], time() + 3600, '/');
    // Rediriger vers l'index
    
    header("Location: $redirect_page");
    echo "<script>window.location.href=\"$redirect_page\"</script>";
    exit();
    
} else {
    echo "Erreur lors de l'authentification.";
}