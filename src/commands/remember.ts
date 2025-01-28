import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import initDB from '../db';


export default {
  data: new SlashCommandBuilder()
    .setName('remember')
    .setDescription('remembers what you said')
    .addStringOption(option =>
      option.setName("msg")
        .setDescription("msg to remember")
        .setRequired(true)
        
    ),


  async execute(interaction: CommandInteraction) {
    // const DB = await initDB();
    // DB.insertOne({"msg" : interaction.options.get("msg")!.value});
    await interaction.reply('YOUR DATA IS MY DATA!');
  }
};
