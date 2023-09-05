import { Id } from "./common";

export type UserStatus =
  | "active"
  | "onboarding"
  | "profile"
  | "signup"
  | "inactive";

export type UserData = {
  activity_level: string;
  bmr: number;
  created_time: Date;
  display_name: string;
  dob: Date;
  email_address: string;
  gender: string;
  goal: string;
  height: number;
  intolerances: [];
  isClient: boolean;
  isAdmin: boolean;
  medication: string;
  phone_number: string;
  photo_url: string;
  uid: string;
  status: UserStatus;
  address?: string;
};

export type User = UserData & Id;

export type FormUser = Pick<UserData, "display_name" | "photo_url">;

export type UserAddress = {
  nickname: string;
  modified_at: Date;
  default_address: boolean;
  created_at: Date;
  archived: boolean;
  address: {
    street: string;
    landmarks: string;
    city: string;
    address_line1: string;
  };
  id: string;
};
