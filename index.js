//-------------
//Begin Connect
//-------------
//Import Discord
const { Client, GatewayIntentBits, CommandInteraction} = require("discord.js");
global.config = require('./config/config.json');//Import Config
global.functions = require('./functions/functions.js');//Import Functions
    //Create Client and announce intents
    const client = new Client({
        fetchAllMembers: true,
        partials: ["CHANNEL", "MESSAGE"],
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
    });
    // login using the provided discord token and report ready
    client.login(config.token)
        .then(r => client.on("ready", () =>{
            console.log("I am ready!");
        }));
//-------------
//End Connect
//-------------

//-------------
//Begin Message Monitoring
//-------------
client.on("messageCreate", (message) => {
    let channelObj = getChannel(message.guildId, message.channel);
    let guildObj =- getGuild(message.guildId);
    const regEx = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;
    //ignore bots
    if(message.author.bot){
        return;
    }

    //If none of the ignored config variables are found continue
    if((config.ignoredChannels.indexOf(message.channelId) === -1) && (config.ignoredCategories.indexOf(channelObj.parent) === -1) && (config.ignoredUsers.indexOf(message.author.id) === -1)){
        //If the message contains a URL
        if(message.content.match(regEx)){
            const savedURL = message.content.match(regEx);
            //If the URL doesn't contain any of our specified domains delete
            for (let i = 0; i < config.validURLs.length; i++) {
                if(message.content.includes(config.validURLs[i])){
                    return;
                }
            }
            //Message contained a URL but was not on the Whitelist so gets deleted
            message.delete().then(r => console.log(`Deleted Non-Whitelisted URL: ${savedURL}`));
            //Log the deletion
            const channel = client.channels.cache.find(channel => channel.id === config.loggingChannel)
            channel?.send(`Deleted Non-Whitelisted URL: ${savedURL} sent by ${message.author}`)
        }
    }
});
//-------------
//End Message Monitoring
//-------------

//-------------
//Begin Helper Functions
//-------------
getChannel = async function (guildID, channelID) {
    try {
        let channel = await client.channels.cache.get(channelID);
        if (channel != null) {
            if (channel.type === 'DM' || channel.guild.id === guildID) {
                return channel;
            }
        }
    }
    catch (error) { }

    return null;
}

getGuild = async function (guildID) {
    try {
        return await client.guilds.cache.get(guildID);
    }
    catch {
        return null;
    }
}
//-------------
//End Helper Functions
//-------------


