import sqlite3
import discord
from discord.ext import commands
import re
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_BOT_TOKEN')

if not TOKEN:
    raise ValueError("Discord bot token not found in .env file. Please check your .env file.")

conn = sqlite3.connect('user_preferences.db', check_same_thread=False)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY,
    timezone TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS user_emails (
    email_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    email TEXT,
    FOREIGN KEY (user_id) REFERENCES user_preferences (user_id)
)
''')
conn.commit()

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

VALID_TIMEZONES = [
    "algiers",
    "new york",
    "london",
    "tokyo",
    "sydney",
    "ksa",
]

@bot.slash_command(name="settimezone", description="Set your timezone for reminders")
async def settimezone(ctx, timezone: str):
    timezone_lower = timezone.lower()

    if timezone_lower not in VALID_TIMEZONES:
        await ctx.respond(
            "Invalid timezone. Please select a timezone from the following:\n"
            "`Algiers`, `New York`, `London`, `Tokyo`, `Sydney`, `KSA`."
        )
        return

    user_id = str(ctx.author.id)
    try:
        cursor.execute('SELECT * FROM user_preferences WHERE user_id = ?', (user_id,))
        user_exists = cursor.fetchone()

        if user_exists:
            cursor.execute('''
            UPDATE user_preferences
            SET timezone = ?
            WHERE user_id = ?
            ''', (timezone_lower, user_id))
        else:
            cursor.execute('''
            INSERT INTO user_preferences (user_id, timezone)
            VALUES (?, ?)
            ''', (user_id, timezone_lower))

        conn.commit()
        await ctx.respond(f"Your timezone has been set to: {timezone_lower.title()}")
    except Exception as e:
        await ctx.respond("An error occurred while updating your timezone. Please try again later.")
        print(f"Error: {e}")

@bot.slash_command(name="addemail", description="Add an email for reminders")
async def addemail(ctx, email: str):
    if not re.match(EMAIL_REGEX, email):
        await ctx.respond("Invalid email address. Please provide a valid email.")
        return

    user_id = str(ctx.author.id)
    try:
        cursor.execute('SELECT * FROM user_preferences WHERE user_id = ?', (user_id,))
        user_exists = cursor.fetchone()

        if not user_exists:
            await ctx.respond("Please set your timezone first using `/settimezone`.")
            return

        cursor.execute('''
        INSERT INTO user_emails (user_id, email)
        VALUES (?, ?)
        ''', (user_id, email))

        conn.commit()
        await ctx.respond(f"Email `{email}` has been added to your preferences.")
    except Exception as e:
        await ctx.respond("An error occurred while adding your email. Please try again later.")
        print(f"Error: {e}")

@bot.slash_command(name="removeemail", description="Remove an email from your preferences")
async def removeemail(ctx, email: str):
    user_id = str(ctx.author.id)
    try:
        cursor.execute('''
        DELETE FROM user_emails
        WHERE user_id = ? AND email = ?
        ''', (user_id, email))

        if cursor.rowcount == 0:
            await ctx.respond(f"Email `{email}` was not found in your preferences.")
            return

        conn.commit()
        await ctx.respond(f"Email `{email}` has been removed from your preferences.")
    except Exception as e:
        await ctx.respond("An error occurred while removing your email. Please try again later.")
        print(f"Error: {e}")

@bot.slash_command(name="viewpreferences", description="View your current preferences")
async def viewpreferences(ctx):
    user_id = str(ctx.author.id)
    try:
        cursor.execute('SELECT timezone FROM user_preferences WHERE user_id = ?', (user_id,))
        timezone_result = cursor.fetchone()

        cursor.execute('SELECT email FROM user_emails WHERE user_id = ?', (user_id,))
        email_results = cursor.fetchall()

        timezone = timezone_result[0] if timezone_result else "Not set"
        emails = [email[0] for email in email_results] if email_results else ["No emails set"]

        await ctx.respond(
            f"Your current preferences:\n"
            f"**Timezone:** {timezone.title() if timezone else 'Not set'}\n"
            f"**Emails:**\n" + "\n".join(f"- {email}" for email in emails)
        )
    except Exception as e:
        await ctx.respond("An error occurred while fetching your preferences. Please try again later.")
        print(f"Error: {e}")

@bot.event
async def on_disconnect():
    conn.close()

bot.run(TOKEN)