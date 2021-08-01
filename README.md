# erc-bot
Discord bot for the ERC FF14 server

## To run the bot:
1. Install docker
2. Clone this repo
3. Copy `src/config_example.ts` and name the copy `config.ts` (leave it in the `src` folder)
4. Edit `config.ts` so that all the token, guildId, logChannelId, channelId, and roleId fields are filled out correctly.
5. Run `docker-compose up -d`
6. To rebuild the bot if there have been changes, run `docker-compose up -d --build`

## Channel Throttling
- Channels can be throttled by adding a `throttling` property to a channel in `config.ts`
  - `tokenRefreshHours` sets the time until the next message can be sent
  - `charLimit` sets the maximum number of characters in a message
  - `newLineLimit` sets the maximum number of new lines in a message

## Logging:
- Multiple log files are configured by default - one for errors only and one for info/warn/errors. More can be added or removed as desired in `config.ts`
- `%DATE%` is used to add in the formatted date to the daily rotation. The date format is controlled by `datePattern`. If `maxFiles` is set, once this number of files is reached the oldest will be deleted
- Console logs are enabled by default. This can be switched off in `config.ts`. The log level for console logs can also be set here
- The chat log colours can be set in `logColours`. The fields here accept anything that resolves to a colour (e.g. `#000000` is valid, as is `0x000000` or `black`)
