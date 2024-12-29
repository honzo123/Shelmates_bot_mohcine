import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import initDB from '../db';


export default {
  data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('ping the bot'),


  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong !');
  }
};
