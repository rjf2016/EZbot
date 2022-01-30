<div align="center">
<br />
<p>
	<img src="images/ezLogo.png" alt="logo" width="80" height="80">
</p>
	<h1 align="center">EZbot</h3>
	<p align="center">
	Multi-purpose bot built with <a href="https://github.com/discordjs/discord.js"><strong>Discord.js</strong></a>
	  </p>
</div>
<br>

## About

EZbot is an open source Discord bot written in TypeScript. This bot requires Discord.js v13+ to make use of slash commands.

## Features

- **Music**:
  - `/play` - Search multiple sources for a song, then play it or put it in a queue
  - `/queue` - View the upcoming songs in queue
  - `/skip` - Skip currently playing song
  - `/seek` - Seek time (in seconds) to jump to
  - `/nowplaying` - Display info about currently playing song
  - `/pause` - Pause current song
  - `/resume` - Resume current song
- **Utility**:
  - `/poll` - Create a poll for users to vote on
  - `/calc` - Open up a calculator... *as a discord message*🤔
- **Moderation**:
  - `/cleanCategory` - Bulk delete multiple channels from a category
  - `/prune` - Bulk delete message from a text channel
- **Info**:
  - `/ping` - View the client's latency
  - `/help` - Get info about a command or view all of EZbot's commands

> More coming soon! I'm porting many commands from a previous bot I created. Stay tuned😄

## Installation

```
git clone https://github.com/rjf2016/EZbot.git
```

After cloning, run:

```bash
yarn # installs dependencies
```

### Setup

To run locally you will need to create a `.env` file in the root directory. I will create an example.env file as soon as I get the chance, but until then feel you can model it off the `environement.d.ts` file.

Head to Discord [Developer Portal](https://discordapp.com/developers/applications/) to create an app - save the client token that you generate. Your .env file should look something like:

```
PROD_TOKEN=<client_token>
GUILD_ID=<your_guild_ID>
NODE_ENV=<production | development>
```

### Run

For developing (with hot reloading) run:

```bash
yarn dev # start typescript server & use dev config
```

To compile and run:

```bash
yarn build # builds javascript source files

yarn start # starts dist/index.js
```

## Credit

[@Reconlx](https://github.com/reconlx) - Heavily inspired how I set up my client/command design pattern.

[discord-player](https://github.com/Androz2091/discord-player) - Awesome framework that simplifies adding music functionality to Discord
