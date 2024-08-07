/*client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: 'GAMEBOT',
        password: 'oauth:b73sv4heoa715fm7nr1ctqxvt97cb7'
    },
    channels: ['d4rkh0und']
});
client.connect();
client.on('message', (channel, tags, message, self) => {
    console.clear();
    if (self) return; // Ignore les messages du bot
    const args = message.split(' ');
    const command = args.shift().toLowerCase();
    if (command == "!rep") {
        const vote = args[0].toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(vote)) {
            if (votes[tags.username] == undefined)
                votes[tags.username] = vote;
            cptVote++;
                let cpt=document.querySelector('[data-val='+vote+']').innerHTML*1;
                cpt++;

                document.querySelector('[data-val='+vote+']').innerHTML=cpt;
                setPercent(vote);
        }
    }
});*/
class GameBot {
    constructor(username, channels, ignore=[],secret = 'b73sv4heoa715fm7nr1ctqxvt97cb7') {
        this.cmd = [];
        this.ignore=[];
        this.channel=channels[0];
        this.client = new tmi.Client({
            options: { debug: true },
            identity: {
                username: username,
                password: `oauth:${secret}`
            },
            channels: channels
        });
    }
    message(message){
       debugger;
            this.client.say(this.channel, `${message}`);
       
    }
    setIgnore(username){
        this.ignore.push(username);
    }
    setCommand(cmd, callback) {
        if (typeof cmd == "string") {
            if (this.cmd[cmd] != undefined) {
                console.error(`${cmd} already exist in current commands`);
                return false;
            }
            this.cmd[cmd] = callback;
            return;
        }
        cmd.forEach(element => {
            if (this.cmd[element] != undefined) {
                console.error(`${cmd} already exist in current commands`);
                return;
            }
            this.cmd[element] = callback;
        });
    }
    openBot = function () {
        this.client.connect();
        this.client.on('message', (channel, tags, message, self) => {
            console.clear();
            if (self) return; // Ignore les messages du bot
            if(this.ignore.includes(tags.username)){//Ignore les autres bots
                return;
            }
            const args = message.split(' ');
            const command = args.shift().toLowerCase();
            if (this.cmd[command] == undefined) {
                return
            }
            this.cmd[command].call(this, args,tags);
        });
    }
}