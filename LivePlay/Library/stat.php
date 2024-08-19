<?php
if(isset($_GET["file"])){
    $content=json_decode(file_get_contents($_GET["file"]),true);
    foreach($content as $question){
        echo "<div>";
        echo "<p>{$question['question']}</p>";
        echo "<ol type='A'>";
        foreach($question["choix"] as $rep){
            echo "<li>$rep</li>";
        }
        echo "</ol>";
        echo "</div>";
    }
}
   $file= scandir("./");
   foreach($file as $f){
    if($f!=".." && $f!="." && $f!="stat.php"){
        $content=json_decode(file_get_contents($f),true);
        $nb=count($content);
        echo "<a href='stat.php?file=$f'>$f</a> => $nb questions <br>";
    }
   }