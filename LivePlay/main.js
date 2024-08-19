
function initParam() {
    votes = [];
    cptVote = 0;
    chat=document.querySelector("#chat>section");
    Array.from(document.querySelectorAll('[data-val]')).forEach(el => {
        el.innerHTML = 0;
    });
}
function openBot() {
    chat = document.querySelector("#chat");
    initParam();
    channel = (channel!="NoChaine") ? channel : "d4rkh0und";
    client = new tmi.Client({
        options: { debug: true },
        identity: {
            username: 'GAMEBOT',
            password: 'oauth:je637klvvxqnfhjoomumuh6eygcr8c'
        },
        channels: [channel]
    });
    client.connect();
    client.on('part', (channel, username, self) => {
        if (!self) {
            let span=document.createElement("span");
            span.innerHTML=`<b>${username}</b> a quitté le chat`
            span.classList.add(".rotate");
            chat.appendChild(span);
            setTimeout(()=>{
                span.classList.remove(".rotate");
            },3000);
        }
      });
    client.on('join', (channel, username, self) => {
        
        if (!self) {
            let span=document.createElement("span");
            span.innerHTML=`<b>${username}</b> a rejoint le chat`
            span.classList.add(".rotate");
            chat.appendChild(span);
            setTimeout(()=>{
                span.classList.remove(".rotate");
            },3000);
            console.log(channel);
        }
      });
      client.on('cheer', (channel, userstate, message) => {
        chat.innerHTML+=`<span><b>${userstate['display-name']}</b> soutien avec ${userstate.bits} bits: ${message}</span>`;
      });
      client.on('raided', (channel, username, viewers) => {
        let span=document.createElement("span");
        span.innerHTML=`<b>${username}</b> vous raid avec ${viewers} spectateurs`
        chat.appendChild(span);
        setTimeout(()=>{
            span.classList.remove(".rotate");
        },3000);
        client.say(channel, `/me ${username} vous avez la possibilité de jouer`);
      });
    client.on('message', (channel, tags, message, self) => {
      //  console.clear();
        if (self) return; // Ignore les messages du bot
        const args = message.split(' ');
        const command = args.shift().toLowerCase();
        if (command == "!rep" || command == "!vote") {
            if (canVote) {
                const vote = args[0].toUpperCase();
                if (['A', 'B', 'C', 'D'].includes(vote)) {
                    if (votes[tags.username] == undefined) {
                        console.dir(tags);
                        votes[tags.username] = vote;
                        cptVote++;
                        let cpt = document.querySelector('[data-val=' + vote + ']').innerHTML * 1;
                        cpt++;
                    //    client.say(channel, `/me ${tags.username} votre réponse a été enregistrée`);
                        let span=document.createElement("span");
                        span.innerHTML=`<b>${tags.username}</b> a répondu<span>`
                      chat.appendChild(span);
                      setTimeout(()=>{
                        span.classList.remove(".rotate");
                    },3000);
                        document.querySelector('[data-val=' + vote + ']').innerHTML = cpt;
                        setPercent(vote);
                    }else{
                        client.say(channel, `/me ${tags.username} Vous avez déjà voter`);
                    }
                }
            } else {
                client.say(channel, `/me ${tags.username} Vous ne pouvez pas encore voter`);
            }

        }
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
function setPercent(val) {
    let alpha = "ABCD";
    var el = document.querySelectorAll(".questionElement.current ol li span");
    el.forEach((item, index) => {
        //  debugger;
        let v = document.querySelector('[data-val=' + alpha[index] + ']').innerHTML * 1;
        prct = Math.floor((v / cptVote) * 100);
        item.innerHTML = `${prct} %`;
    })
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
function getUrlVariable() {
    var _url = document.location.href;
    var _arr = _url.split("?")[1];
    if (_arr != undefined)
        return _arr.split('&').reduce(function (prev, current) {
            let _item = current.split("=");
            prev[_item[0]] = _item[1];
            return prev;
        }, [])
    else
        return false;
}
function modal(idEl) {
    document.getElementById(idEl).style.display = "flex";
}
function _alert(msg, onclose, css) {
    var _overlay = document.createElement("div");
    _overlay.classList.add("overlay");
    var _m = document.createElement("div");
    if (css != undefined) {
        for (let _v in css) {
            _m.style[Object.keys(_v)] = _v;
        }
    }
    _m.innerHTML = msg;
    _overlay.appendChild(_m);
    _overlay.onclick = function () {
        this.remove();
        if (onclose != undefined)
            onclose();
    }
    document.body.prepend(_overlay);

}