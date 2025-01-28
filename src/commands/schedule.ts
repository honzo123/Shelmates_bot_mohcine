import { Message } from 'discord.js';

export default async function scheduleCommand(message: Message) {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Extract the command arguments
  const args = message.content.split(' ').slice(1); // split it into array
if (args.length==0){
  
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
     
      let mentionedRoles:any = message.mentions.roles.map((role) => role.toString());
       if (mentionedRoles.length === 0) {
        mentionedRoles=role
       }
      const scheduleData = {
        title,
        dateTime,
        roleIds: message.mentions.roles.map((role) => role.id), 
        rolename:mentionedRoles,
        description,
        meetLink
    };
    let confirmationMessage = `
    Meeting scheduled successfully!
    **Title:** ${scheduleData.title}
    **Date:** ${scheduleData.dateTime.toLocaleString('en-US', {
      weekday: 'long', // e.g., "Tuesday"
      year: 'numeric', // e.g., "2023"
      month: 'long',   // e.g., "October"
      day: 'numeric',  // e.g., "10"
      hour: '2-digit', // e.g., "02"
      minute: '2-digit', // e.g., "30"
      hour12: false // Use 24-hour format
  })}
    **Role:** ${scheduleData.rolename}
    `;
    
                   
                    if (description) {
                        confirmationMessage += `**Description:** ${description}\n`;
                    }
    
                    // Add Google Meet link
                    if (meetLink) {
                        confirmationMessage += `**    Google Meet Link:** ${meetLink}\n`;
                    }

  return message.reply(confirmationMessage);
  }else return message.reply('Usage: !schedule "Meeting Title" YYYY-MM-DD HH:mm @participants');



  // Validate the number of arguments
 /* if (args.length < 3) {
    return message.reply('Usage: !schedule "Meeting Title" YYYY-MM-DD HH:mm @participants');
  }*/

  // Parse the arguments
  //const [title, dateStr, timeStr, ...participants] = args;

  // Combine date and time into a single string
 

  // Validate the date and time format
 
  

  // Extract mentioned users or roles
  /*const mentions = message.mentions.users.map((user) => user.toString());
  const roleMentions = message.mentions.roles.map((role) => role.toString());*/

  // Combine all participants
  // Send a confirmation message
 
}