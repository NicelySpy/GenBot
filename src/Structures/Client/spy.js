const {
	ApplicationCommandType,
	Client,
	Collection,
	GatewayIntentBits,
	Partials
} = require('discord.js');
const path = require('path');
const { glob } = require('glob');
const globPromise = require('util').promisify(glob);
const config = require('@root/config.json');
const { AsciiTable3: ascii } = require('ascii-table3');
const mongoose = require('mongoose');
const chalk = require('chalk');
const { errLogger } = require('@function/logger.js');

class Spider extends Client {
	constructor() {
		super({
			intents: [
				GatewayIntentBits.DirectMessageReactions,
				GatewayIntentBits.DirectMessageTyping,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildIntegrations,
				GatewayIntentBits.GuildInvites,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildMessageTyping,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildScheduledEvents,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildWebhooks,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent
			],
			partials: [
				Partials.User,
				Partials.Channel,
				Partials.Message,
				Partials.GuildMember,
				Partials.Reaction,
				Partials.GuildScheduledEvent,
				Partials.ThreadMember
			],
			allowedMentions: {
				repliedUser: false
			}
		});
		this.commands = {
			collection: new Collection(),
			array: []
		};
		this.contexts = {
			collection: new Collection(),
			array: []
		};
		this.events = {
			map: new Map()
		};
		this.errLogger = errLogger;
		this.config = config;
		this.token = config.token;
		this.owners = config.owners;
		this.mongoURI = config.mongooseConnectionString;
		this.utils = new (require('@function/util.js'))();
		this.wait = require('node:util').promisify(setTimeout);
	}
	async deleteCachedFile(file) {
		const filePath = path.resolve(file);
		if (require.cache[filePath]) delete require.cache[filePath];
	}
	async loadFiles(dirPath) {
		try {
			const jsF = (await glob(
				path.join(process.cwd(), dirPath).replace(/\\/g, '/')
			)).filter(file => path.extname(file) === '.js');
			await Promise.all(jsF.map(this.deleteCachedFile));
			return jsF;
		} catch (error) {
			console.error(`${dirPath}: ${error}`);
			throw error;
		}
	}

	async loadEvents() {
		console.time('Events Loader');
		const table = new ascii('Events Status')
			.setHeading('Events', 'Status')
			.setStyle('unicode-single');
		const file = await this.loadFiles('src/Events/**/*.js');
		for (const f of file) {
			try {
				const ev = require(f);
				const client = this;
				const run = (...args) => ev.run(client, ...args);
				const target = ev.rest ? client.rest : client;
				target[ev.once ? 'once' : 'on'](ev.name, run);
				this.events.map.set(ev.name, run);
				table.addRow(`${ev.name}`, '✅️');
			} catch (err) {
				console.error(
					`${f
						.split('/')
						.pop()
						.slice(0, -3)}: ${err}`
				);
				table.addRow(
					`${f
						.split('/')
						.pop()
						.slice(0, -3)}`,
					'❌️'
				);
			}
		}
		console.log(table.toString());
		console.timeEnd('Events Loader');
	}
	async loadCommands() {
		console.time('Commands Loader');
		const table = new ascii('Commands Status')
			.setHeading('Commands', 'Status')
			.setStyle('unicode-single');
		await this.commands.collection.clear();
		for (const f of await this.loadFiles('src/Commands/Slash/**/*.js')) {
			try {
				const cmd = require(f);
				table.addRow(`${cmd.data.name}`, '✅️');
				this.commands.collection.set(cmd.data.name, cmd);
				this.commands.array.push(cmd.data.toJSON());
			} catch (err) {
				console.error(
					`${f
						.split('/')
						.pop()
						.slice(0, -3)}: ${err}`
				);
				table.addRow(
					`${f
						.split('/')
						.pop()
						.slice(0, -3)}`,
					'❌️'
				);
			}
		}
		console.log(table.toString());
		console.timeEnd('Commands Loader');
	}
	async loadContexts() {
		console.time('Contexts Loader');
		const table = new ascii('Context Status')
			.setHeading('Context', 'Status')
			.setStyle('unicode-single');
		await this.contexts.collection.clear();
		(await this.loadFiles('src/Commands/Context/**/*.js')).forEach(f => {
			try {
				const ctx = require(f);
				table.addRow(`${ctx.data.name}`, '✅️');
				this.contexts.collection.set(ctx.data.name, ctx);
				this.contexts.array.push(ctx.data.toJSON());
			} catch (err) {
				console.error(
					`${f
						.split('/')
						.pop()
						.slice(0, -3)}: ${err}`
				);
				table.addRow(
					`${f
						.split('/')
						.pop()
						.slice(0, -3)}`,
					'❌️'
				);
			}
		});

		console.log(table.toString());
		console.timeEnd('Contexts Loader');
	}
	antiCrash() {
		process.on('unhandledRejection', (reason, p) => {
			console.log(' [antiCrash] :: Unhandled Rejection/Catch');
			console.log(reason, p);
		});
		process.on('uncaughtException', (err, origin) => {
			console.log(' [antiCrash] :: Uncaught Exception/Catch');
			console.log(err, origin);
		});
		process.on('uncaughtExceptionMonitor', (err, origin) => {
			console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
			console.log(err, origin);
		});
		process.on('multipleResolves', (type, promise, reason) => {
			console.log(' [antiCrash] :: Multiple Resolves');
			console.log(type, promise, reason);
		});
	}
	mongooseConnection() {
		if (!this.mongoURI) return;
		mongoose.connect(
			this.mongoURI,
			);
		mongoose.set("strictQuery", true)
		mongoose.connection.on('connected', () =>
			console.log(
				chalk.cyan('[INFORMATION]') +
					chalk.blue(` ${new Date().toLocaleDateString()} `) +
					chalk.cyan('MongoDB Connection ') +
					chalk.greenBright('Connected!')
			)
		);
		mongoose.connection.on('disconnected', () =>
			console.log(
				chalk.cyan('[INFORMATION]') +
					chalk.blue(` ${new Date().toLocaleDateString()} `) +
					chalk.cyan('MongoDB Connection ') +
					chalk.greenBright('Disconnected')
			)
		);
		mongoose.connection.on('error', error =>
			console.log(
				chalk.cyan('[INFORMATION]') +
					chalk.blue(` ${new Date().toLocaleDateString()} `) +
					chalk.cyan('MongoDB Connection ') +
					chalk.redBright('Error') +
					'\n' +
					chalk.white(`${error}`)
			)
		);
	}
	install() {
		this.login(this.config.token);
		this.antiCrash();
		this.loadCommands();
		this.loadEvents();
		this.loadContexts();
	}
}
module.exports = { Spider };
