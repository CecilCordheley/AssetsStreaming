<?php
session_start();
$chaine="NoChaine";
$client_id = 'wb27474oevxe4alz4ffm3wcg26kef6';
$redirect_uri = 'https://game.schoolweb.fr/LivePlay/callback.php';
$scope = 'user:read:email';
if(isset($_GET["deconnect"])){
    session_destroy();
}
$local=true;
$soundFile=["Chrono.wav","Chrono2.wav"][rand(0,1)];
if ($_SERVER['HTTP_HOST'] != 'localhost' && $_SERVER['HTTP_HOST'] != '127.0.0.1'){
    $local=false;
if (!isset($_SESSION['access_token'])) {
    $auth_url = "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=$client_id&redirect_uri=$redirect_uri&scope=$scope";
    echo "<a class='twitch_connexion' href='$auth_url'>Se connecter avec Twitch</a>";
} else {
    $access_token = $_SESSION['access_token'];

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://api.twitch.tv/helix/users');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $access_token,
    'Client-ID: ' . $client_id
]);

$response = curl_exec($curl);
curl_close($curl);

$user_data = json_decode($response, true);
/*echo "<pre>";
print_r($user_data);
echo "</pre>";*/
    $chaine=$user_data["data"][0]["login"];
    echo "<a class='twitch_connexion' href='index.php?deconnect='>Se déconnecter</a>";
}
}
$library="question.json";
switch($chaine){
    case "chriceratopss":
        $library="harrypotter2.json";
        break;
        case "d4rkh0und":{
            $files=["question.json","question2.json","question4.json"];
            $rand=rand(0,count($files));
            $library=$files[$rand];
            $theme="Jeux Vidéo";
            break;
        }
        default:{
            $files=["question.json","question2.json","question4.json"];
            $rand=rand(0,count($files)-1);
            $library=$files[$rand];
            $theme="Jeux Vidéo";
            break;
        }
            
           
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Play</title>
    <meta property="og:title" content="LivePlay">
    <meta property="og:description" content="laisser votre chat twitch répondre aux questions">
    <meta property="og:image" content="https://game.schoolweb.fr/img/LivePlay_Miniature.png">
    <meta property="og:url" content="<?php echo " https://" . $_SERVER["SERVER_NAME"] . "" . $_SERVER["PHP_SELF"] ?>">
    <link rel="stylesheet" href="main.css">
    <script src="tmi.min.js"></script>
    <script src="main.js"></script>
    <script src="soundManager.js"></script>
    <script src="game.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        [data-val]::before {
            content: attr(data-val)' ';
        }
    </style>
</head>

<body>
    <a href='#' id='reload' class='twitch_connexion' onclick="window.location.reload()">Recommencer</a>
    <?php
     if($chaine!="NoChaine" || $local){ ?>
    <div class="intro">
        <div class="rules">
            <p>Nous allons poser 10 questions sur un thème précis. Vous aurez la possibilité de voter pour la bonne
                réponse A,B,C ou D à l'aide de la commande dans le chat <b>!vote</b> ou <b>!rep</b> suivi de la réponse
            </p>
            <p>Attention, vous aurez que 80 secondes pour voter</p>
            <label for="getTheme">Theme du quizz</label>
            <select id="getTheme">
                <option value="0">Jeux Vidéo</option>
                <option value="1">Harry Potter</option>
                <option value="2">Série</option>
                <option value="3">Cinema</option>
            </select>
            <button title="Commencer" id="star">
                <i class="fa-solid fa-chess"></i>
            </button>
            <div>

            </div>
        </div>
    </div>
    <h1>Live Play avec le chat de
        <span>
            <?php echo $chaine; ?>
        </span>
    </h1>


    <audio id="win">
        <source src="./Sound/Win.wav" type="audio/wav">
    </audio>
    <audio id="loose">
        <source src="./Sound/Lose.wav" type="audio/wav">
    </audio>
    <audio name="chrono">
        <source src="./Sound/Chrono.wav" type="audio/wav">
    </audio>
    <audio name="chrono">
        <source src="./Sound/Chrono2.wav" type="audio/wav">
    </audio>
    <audio name="chrono">
        <source src="./Sound/Chrono3.wav" type="audio/wav">
    </audio>
    <div id="container">
        <div id="gain">
            <div id="joker">
                <a class="btn" name="jkr" href="#">Joker</a>
                <a class="btn" name="switch" href="#">Switch</a>
            </div>
            <div class="timer"><span></span></div>
            <ul>
            </ul>
            <span id="indexQuestion"></span>
            <div id="prgs_container">
                <div id="prgs_current"></div>
            </div>
            <button title="couper le son du timer" id="soundSwitch">
                <i class="fa-solid fa-volume-high"></i>
            </button>
        </div>
        <div id="chat">

            <h3>Chat</h3>
            <a href="#" name="close"><i class="fa-solid fa-xmark"></i></a>
            <section>
            </section>
        </div>
        <div id="question">
            <div class="command">
                <button id="canVote">Commencer les votes</button>
                <button id="check">Vérifier</button>
            </div>
            <div class="query">
                <button name="next">Continuer</button>
            </div>
        </div>
        <div id="reponsePrct">
            <span data-val="A">0</span>
            <span data-val="B">0</span>
            <span data-val="C">0</span>
            <span data-val="D">0</span>
        </div>
    </div>
    <script>
        //  initializeElement();
        var channel = "<?php echo $chaine; ?>";
        document.querySelector("[name=close]").onclick = function () {
            this.parentElement.style.display = "none";
        }
        document.querySelector("#reload").style.display = "none";
        document.querySelector("#soundSwitch").onclick = function () {
            var soundEnable = true;
            if (soundEnable) {
                this.innerHTML = "<i class=\"fa-solid fa-volume-high\"></i>"
                this.setAttribute("title", "couper le son du timer");
            } else {
                this.innerHTML = "<i class=\"fa-solid fa-volume-xmark\"></i>";
                this.setAttribute("title", "remettre le son du timer");
                sndChrono[getRandomInt(2)].pause();
            }
        }
        document.querySelector("#star").onclick = function () {
            document.querySelector(".intro").style.display = "none";
            
            getQuizz("Library/" + getLibrary() );
        }
    </script>
    <?php }else{ ?>
    <div class="intro">
        <div class="rules">
            <p>Veuillez vous connecter sur twitch afin que l'on accède à votre chat</p>
        </div>
    </div>
    <h1>Live Play avec le chat de twitch</h1>
    <?php } ?>
</body>

</html>