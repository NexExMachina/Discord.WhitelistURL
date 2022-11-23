//-------------
//Begin Reactions
//-------------
//Change Reactions Depending on Config
addReactions = function (message){
    switch (config.reactionType) {
        case 1:
            message.react("❤");
            break;
        case 2:
            message.react("⬆");
            message.react("⬇");
            break;
        default:
            return;
    }
};
//-------------
//End Reactions
//-------------

//-------------
//Begin Check Validity
//-------------
//Checks messages for valid types returns false if not
validateMessage = function(message) {
    for (let i = 0; i < config.validURLs.length; i++) {
        if(message.content.includes(config.validURLs[i])){
            return true;
        }
    }
    if(message.attachments.size > 0){
        return true;
    }
    if (message.author.bot){
        return false;
    }
    return false;

}
//-------------
//End Check Validity
//-------------
