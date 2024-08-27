<?php
if(isset($_GET["file"])){
    if($_GET["file"]!="reserve.json"){
    $content=json_decode(file_get_contents($_GET["file"]),true);
    $i=0;
    foreach($content as $question){
        $i++;
        echo "<div>";
        echo " <p>$i -{$question['question']}</p>";
        echo "<ol type='A'>";
        foreach($question["choix"] as $rep){
            echo "<li>$rep</li>";
        }
        echo "</ol>";
        echo "</div>";
    }
    }else{
        $content=json_decode(file_get_contents($_GET["file"]),true);
             foreach($content as $key=>$value){
                echo "<h3>$key</h3>";
                $i=0;
                foreach($value as $question){
                    $i++;
                    echo "<div>";
                    echo "<p>$i - {$question['question']}</p>";
                    echo "<ol type='A'>";
                    foreach($question["choix"] as $rep){
                        echo "<li>$rep</li>";
                    }
                    echo "</ol>";
                    echo "</div>";
                }
             }
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