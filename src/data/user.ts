import { UserStatus } from "@/types/user";
import createOptions from "@/utils/createOptions";

export const userStatusMapped: Record<UserStatus, string> = {
  active: "Active",
  onboarding: "Onboarding",
  profile: "Profile",
  signup: "Signup",
  inactive: "Inactive",
};

export const userStatusOptions = createOptions<UserStatus>(userStatusMapped);

export const userStatusColorScheme: Record<UserStatus, string> = {
  active: "green",
  onboarding: "yellow",
  profile: "orange",
  signup: "purple",
  inactive: "red",
};
