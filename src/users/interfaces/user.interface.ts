import { ObjectId } from 'mongodb';

export interface UserInterface {
  _id: ObjectId;
  username:string;
  email: string;
  password?: string;
  roles:[string];
  profilePicRef:string,
  __v: number;
}