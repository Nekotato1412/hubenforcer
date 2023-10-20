require("dotenv").config()

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

const pattern = /^(https:\/\/discord\.gg\/.+).*$/g

function checkMessage(content) {
    return pattern.test(content)
}

function enforce(msg) {
    if (!msg.author) return
    if (!checkMessage(msg.content)) {
        msg.channel.send("❌ You may only send invite links. If you'd like to chat, consider DMing a member or joining a server.")

        if (msg.deletable) {
            msg.delete()
        }

        return
    }

    msg.react("✅")
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, msg => {
    if (msg.author.bot) {
        return setTimeout(() => {
            if (msg.deletable) {
                msg.delete()
            }
        }, 4000)
    }
    enforce(msg)
})

client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
    enforce(newMessage)
})


// Log in to Discord with your client's token
client.login(process.env["TOKEN"]);
