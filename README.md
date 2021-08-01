# erc-bot
Discord bot for the ERC FF14 server

To run the bot:
1. Install docker
2. Clone this repo
3. Copy `src/config_example.ts` and name the copy `config.ts` (leave it in the `src` folder)
4. Edit `config.ts` so that all the token, channelId, and roleId fields are filled out correctly.
5. Run `docker-compose up -d`
6. To rebuild the bot if there have been changes, run `docker-compose up -d --build`
