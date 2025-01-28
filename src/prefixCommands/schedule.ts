import { Message } from 'discord.js';
import Reminder, { IReminder, ReminderType } from "../schemas/reminder";

export default async function scheduleCommand(message: Message) {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Extract the command arguments
  const args = message.content.split(' ').slice(1); // split it into array
  if (args.length == 0) {

    return message.reply(` 
To schedule a meeting, use the following format:
\`!schedule "Title of the Meeting" YYYY-MM-DD HH:MM @Role [Optional: Description] [Optional: Google Meet Link]\`

Example:
\`!schedule "Team Sync" 2023-10-10 14:30 @Developers "Weekly team sync meeting" https://meet.google.com/abc-xyz\ `);

  }
  // Join the remaining parts to handle spaces in the title
  const remainingArgs = args.join(' '); // convert it back to string

  // Regular expression to extract the title, date, time, and role
  const regex = /"([^"]+)"\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(<@&\d+>|<@!?\d+>|@everyone|@here)(?:\s+"([^"]*)")?(?:\s+(https?:\/\/\S+))?/;
  const match = remainingArgs.match(regex); // matvh it at this format 

  if (match) {
    const title = match[1]; // Extracted title
    const date = match[2];  // Extracted date (YYYY-MM-DD)
    const time = match[3];  // Extracted time (HH:MM)
    const role = match[4];  // Extracted role (@role)
    const description = match[5] || null;
    const meetLink = match[6] || null;
    const dateTimeStr = `${date} ${time}`;
    const dateTime = new Date(dateTimeStr);
    if (isNaN(dateTime.getTime())) {
      return message.reply('Invalid date or time format. Use YYYY-MM-DD HH:mm.');
    }
    // const mentionedUsers = message.mentions.users.map((user) => user.toString());

    let mentionedRoles: any = message.mentions.roles.map((role) => role.toString());
    if (mentionedRoles.length === 0) {
      mentionedRoles = role
    }
    const scheduleData = {
      title,
      dateTime,
      roleIds: message.mentions.roles.map((role) => role.id),
      rolename: mentionedRoles,
      description,
      meetLink
    };



 
    insertReminder(scheduleData,message);
    return;








  } else return message.reply('Usage: !schedule "Meeting Title" YYYY-MM-DD HH:mm @participants');
}

async function insertReminder(
  scheduleData: {
    title: string;
    dateTime: Date;
    roleIds: string[]; // Array of role IDs
    rolename: string[] | string; // Mentioned roles or a single role
    description: string | null; // Optional description
    meetLink: string | null; // Optional Google Meet link
  },
  message: Message
) {
  const { title, dateTime, rolename, description, meetLink } = scheduleData;

  const reminderData = {
    userId: message.author.id, 
    title,
    date: dateTime,
    type: "Meet" as ReminderType,
    description: description || "",
    leadTimeMs: null, 
    channelId: message.channel.id, 
    timezone: "UTC", 
    createdAt: new Date(),
    meetLink: meetLink,
  };

  try {
    // Save reminder to the database
    const newReminder = new Reminder(reminderData);
    await newReminder.save();

    // Send confirmation message
    let confirmationMessage = `
    🎉 **Meeting Scheduled Successfully!**
    **Title:** ${title}
    **Date & Time:** ${dateTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}
    **Role:** ${Array.isArray(rolename) ? rolename.join(", ") : rolename}
    `;

    if (description) {
      confirmationMessage += `**Description:** ${description}\n`;
    }

    if (meetLink) {
      confirmationMessage += `**Google Meet Link:** ${meetLink}\n`;
    }

    return message.reply(confirmationMessage);
  } catch (error) {
    console.error("Error saving reminder:", error);
    return message.reply(
      "There was an error scheduling your meeting. Please try again later."
    );
  }
}
