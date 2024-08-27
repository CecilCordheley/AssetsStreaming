var index = -1;
var query = [];
var nextBtn, voteBtn;
var queryBlock;
var score = { current: 0, mois: 0 };
var _index = -1;
var pallier = 3;
var checkBtn;
var joker;
var timer_counter = 0;
var lastQuestion = -1;
var intervalReponse = 1500;
var canVote = false;
let soundVolume = 100;
let sndSlash;
let sndGlasses;
let sndWin;
let sndLoose;
let sndExtract;
var indexChrono = 0;
var BotClient = null;
var chat = null;
var votes = [];
var cptVote = 0;
var cptinfo = 0;
var equal=false;
var config={
    canPlay:false,
    soundEnable:true,
    getWinner:true
};
var rep = { "A": 0, "B": 0, "C": 0, "D": 0 }
library = [
    [
        "question.json", "question2.json", "question3.json", "question4.json"
    ],
    ["HarryPotter1.json", "harrypotter2.json"],
    ["serie.json"],
    ["test.json"],
    ["cinema.json","cinema2.json"],
    ["musique.json"]
];
/** Récupère le questionnaire en AJAX */
function getLibrary() {
    //debugger
    let select = document.getElementById("getTheme");
    let a = library[select.value * 1];
    if (a.length > 1)
        return a[getRandomInt(a.length) - 1];
    else
        return a[0];
}
function fetchQuizz(file) {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", file, false);
        xhr.send();
        query = JSON.parse(xhr.responseText);
        query = shuffle(query);
        query = query.slice(0, 10);
        pallier = parseInt(query.length / 3);
    } catch (e) {
        console.log(e);
        _alert("Mince le questionnaire n'a pas pu ce charger, la page va se recharger", function () {
            window.location.href = "index.php";
        })
    }
}

/** Initialise les éléments DOM de la page */
function initializeElement() {
    openBot();
  //  debugger
    joker = document.querySelector("[name=jkr]");
    voteBtn = document.querySelector("#canVote");
    voteBtn.style.display="none";
    let extractAudio=document.getElementById("Extract");
    extractAudio.onpause=function(){
        let _btn=document.getElementById("ExecExtract");
        _btn.innerHTML="Ecouter l'extrait <i class=\"fa-solid fa-volume-high\"></i>"
    }
    voteBtn.onclick = function () {
        if (config.soundEnable)
            playChrono();
        this.style.display = "none";
        canVote = true;
        client.say(channel, "/me vous pouvez commencer à voter utilisez la commande <!vote> ou <!rep> suivi de la réponse [A,B,C ou D]");
        setTimer();
    }
    document.querySelector('[name=switch]').onclick = function () {
        if (this.classList.contains("used")) {
            return false;
        } else {
            replaceQuestion();
            this.classList.add("used");
            return false;
        }
    }

    joker.style.visibility = "hidden";
    queryBlock = document.querySelector(".query");
    nextBtn = document.querySelector("[name=next]");
    checkBtn = document.querySelector("#check");
    checkBtn.onclick = function () { check(); };
    nextBtn.onclick = next;

}
function replaceQuestion() {
    clearTimeout(timer_counter) //reset le timeout
    const progressBarEl = document.querySelector(".timer");
    progressBarEl.style.background="linear-gradient(white, white) content-box no-repeat,conic-gradient(#2A36EE 0%, 0, #666 ) border-box;"

    lastQuestion = query[query.length - 1];
    query[index] = lastQuestion;
    document.querySelector(".current p").innerHTML = lastQuestion.question;
    var choice = document.querySelectorAll(".current ol li");
    lastQuestion.choix.forEach(function (el, i) {
        choice[i].innerHTML = el;
    })

    /* if (hasTimer()) {
         
     }*/

}
/** Retourne le composant de la question */
function generateQuestion(question) {
    var _div = document.createElement("div");
    _div.classList.add("questionElement");

    var p = document.createElement("p");
    p.innerHTML = question.question;
    _div.append(p);

    var ol = document.createElement("ol");
    question.choix.forEach((element, index) => {
        var li = document.createElement("li");
        li.innerHTML = element + " <span>0%</span>";
        ol.append(li);
    });
    _div.append(ol);
    //debugger;
    var _displayInfo = question.info ?? false;
    
    if (_displayInfo) {
        cptinfo++;
        var _info = document.createElement("section");
        _info.style.display = "none";
        _info.innerHTML = setInfoDisplay(question.info)
        _div.append(_info);
    }

    return _div;
}
function setInfoDisplay(infos) {
    var re = /list\:((.*?)*)/g;
    var array = [...infos.matchAll(re)]
    if (array.length != 0) {
        var _r = array[0][1].split("|").reduce(function (carry, el) {
            carry += "<li>" + el + "</li>";
            return carry;
        }, "");
        return "<ul>" + _r + "</ul>";
    } else
        return infos;

}

function getQuizz(file = "Library/harrypotter2.json") {
    initSounds();
    initializeElement();
    fetchQuizz(file);
    var gainList = document.querySelector("#gain ul");
    var containerQuestion = document.querySelector("#question");
    query.reduce(function (carry, item) {
        carry.append(generateQuestion(item));
        let li = document.createElement("li");
        gainList.appendChild(li);
        return carry;
    }, containerQuestion);

    next();
}
function getReponse() {
    let alpha = "ABCD";
    //  debugger;
    let dataVal = Array.from(document.querySelectorAll("[data-val]"));
    dataVal.sort((a, b) => {
        let numA = parseFloat(a.innerHTML.trim());
        let numB = parseFloat(b.innerHTML.trim());

        // Comparer les nombres
        return numB - numA;
    });
    equal=(dataVal[0]==dataVal[1]);
        let rep = dataVal[0].getAttribute("data-val");
        return alpha.indexOf(rep);
    
}
function checkEqual(){
    //  debugger;
    let dataVal = Array.from(document.querySelectorAll("[data-val]"));
    dataVal.sort((a, b) => {
        let numA = parseFloat(a.innerHTML.trim());
        let numB = parseFloat(b.innerHTML.trim());

        // Comparer les nombres
        return numB - numA;
    });
    equal= (dataVal[0].innerHTML==dataVal[1].innerHTML);
    console.log(equal);
}
function getWinner(rep){
    //1. Les réponses possible
    const msgs=[`/me #user# a gagné`,`/me Bravo #user#`,`\me Bien joué #user#`];
    const choice="ABCD";
    // 2. Vérifier les utilisateur qui ont voté
    for (let user in votes) {
        let vote = votes[user];
        if(vote==choice[rep]){
            let m=msgs[getRandomInt(2)];
            m=m.replace("#user#",user);
            client.say(channel, m);
        }
      
    }
}
function check() {
    if (!canVote) {
        _alert("Votre chat doit d'abort voter pour une réponse");
        return;
    }
    clearTimeout(timer_counter) //reset le timeout
    _index = getReponse();
    sndChrono[indexChrono].pause();
    if (_index == -1)
        return;
    else
        checkBtn.style.display = "none";
    //  debugger;
    var _displayInfo = query[index].info ?? false;
    var _media = query[index].media ?? false;
    if (_displayInfo) {
        document.querySelector(".questionElement.current>section").style.display = "block";
        document.querySelector(".questionElement.current>section").onclick = function () {
            this.style.display = "none";
        }
    }if(_media){
        console.log(query[index].media);
        let s=document.querySelector("#Extract");
        s.setAttribute("src","Sound/"+query[index].media);
        document.getElementById("ExecExtract").style.display="block";
    }
    if (query[index].reponse == _index) {
        clearTimeout(timer_counter)
        const progressBarEl = document.querySelector(".timer");
        progressBarEl.style.background=`linear-gradient(white, white) content-box no-repeat,conic-gradient(#2A36EE 0%, 0, #666 ) border-box;`
        var questions = document.querySelectorAll(".questionElement");
        var _w = (index < questions.length - 1) ? ((index) / questions.length) * 100 : 100;
        if (_w == 0) { _w = 2; }
        document.querySelector("#prgs_current").style.width = _w + "%";
        playWin();
        document.querySelectorAll('#gain ul li')[index].classList.add("good");
        document.querySelectorAll(".questionElement.current ol li")[query[index].reponse].classList.add("good");
        score.current++;


    } else {
        playLoose();
        document.querySelectorAll('#gain ul li')[index].classList.add("bad");
        document.querySelectorAll(".questionElement.current ol li")[query[index].reponse].classList.add("bad");
        /*  _alert("Tu as perdu, essaie encore ?", () => {
              document.location.reload();
          })*/
    }
    if(config.getWinner){
        getWinner(query[index].reponse);
    }
    initParam();
    queryBlock.style.display = "flex";
}
function hasTimer() {
    return (getUrlVariable()?.["timer"] ?? "off") == "on";
}
function getDuring() {
    return 180;

}
function setTimer() {
    const progressBarEl = document.querySelector(".timer");
    let d = 80;
    // debugger
    let remainingTime = d; // seconds
    const totalTime = remainingTime;
    progressBarEl.style.background = `linear-gradient(#333, #111) content-box no-repeat,conic-gradient(#2A36EE 100%, 0, #666 ) border-box`;
    function countdown() {
        if (remainingTime > 0) {
            // update countdown timer
            // countdownEl.textContent = remainingTime;

            // update progress bar
            const progress = ((totalTime - remainingTime) / totalTime) * 100;
            progressBarEl.style.background = `linear-gradient(#333, #111) content-box no-repeat,conic-gradient(#2A36EE ${progress}%, 0, #666 ) border-box`;
          //  checkEqual();
            //     console.log(remainingTime);
            remainingTime--;
            timer_counter = setTimeout(countdown, 1000);
        } else {
            // countdown finished
            progressBarEl.style.background = `linear-gradient(#333, #111) content-box no-repeat,conic-gradient(#2A36EE 100%, 0, #666 ) border-box`;
            clearTimeout(timer_counter);

            if (cptVote > 0) {
                check();
            } else
                setLoose();

            /* _alert("Time's Up", function () {
                 document.location.reload();
             });*/
            //       countdownEl.textContent = "Time's up!";
        }
    }
    countdown();

}
function setLoose() {
    playLoose();
    document.querySelectorAll('#gain ul li')[index].classList.add("bad");
    document.querySelectorAll(".questionElement.current ol li")[query[index].reponse].classList.add("bad");
    next();
}
function next() {
    _index = -1;
    document.getElementById("ExecExtract").style.display="none";
    document.getElementById("Extract").pause();
    voteBtn.style.display = "none";
    equal=false;
    canVote = false;
    checkBtn.style.display = "block";
    var questions = document.querySelectorAll(".questionElement");

    if (index + 1 > questions.length - 1) {
        var correct = document.querySelectorAll ("#gain ul li.good").length;
        var tot = document.querySelectorAll("#gain ul li").length;
        _alert(`${correct} sur ${tot}`, function () {
            window.location.reload();
        });
        document.querySelector("#reload").style.display = "block";
    }
    else {

        let l = query.length;
        document.querySelector('#indexQuestion').innerHTML = "Question " + (index + 2) + "/" + l;
        queryBlock.style.display = "none";
        questions.forEach(element => {
            element.classList.remove("current");
            element.style.display = "none";
        });
        index++;
        questions[index].style.display = "block";
        questions[index].classList.add("current");

        var _currentQuestion = document.querySelectorAll(".current ol li");
        _currentQuestion.forEach(function (item) {
            item.style.opacity = 0;
        });

        if (query[index].joker != undefined) {
            joker.style.visibility = "visible";
            joker.onclick = function () {
                if (!joker.classList.contains("used")) {
                    _currentQuestion[query[index].joker[0]].style.visibility = "hidden";
                    _currentQuestion[query[index].joker[1]].style.visibility = "hidden";
                    this.classList.add("used");
                }
                return false;
            };
        } else {
            joker.style.visibility = "hidden";
        }

        setTimeout(function () {
            var i = 0;
            var t = setInterval(function () {
                if (i < 4) {
                    _currentQuestion[i].style.opacity = 1;
                    i++;
                } else {
                    clearInterval(t);

                    /*  if (hasTimer()) {
                          
                      }*/
                }
            }, intervalReponse);
        }, 2000);
        voteBtn.style.display="block";
    }
}