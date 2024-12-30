import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";


export type ReminderType = "Meet" | "Event" | "Notification";
export type ReminderStatus = "Pending" | "Notified" | "Canceled";


export interface IReminder extends Document {
    // auto generated
    id : string,
    userId: Schema.Types.ObjectId | IUser, 
    channelId?: string,            
    createdAt: Date,              
    status?: ReminderStatus,  

    // required
    title: string,                
    date: Date,               

    // optional
    desc?: string,                
    leadTimeMs?: number,      
    timezone?: string,            
    type: ReminderType ,
};

const ReminderSchema = new mongoose.Schema({
    // auto generated
    id: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", require: true, },
    channelId: String,
    createdAt: Date,
    status: {type: String, default: "Pending" , enum: ["Pending" , "Notified" , "Canceled"]},

    // required
    title: String,
    date: Date,

    // optional
    desc: {type: String, require: false, default: ''},
    leadTimeMs: {type: Number, default: 0},
    timezone: { type: String, require: false, default: null },
    type: {type: String, default : "Notification" , enum: ["Meet" , "Event" , "Notification"] },
});




export default mongoose.model<IReminder>("Reminder", ReminderSchema);

