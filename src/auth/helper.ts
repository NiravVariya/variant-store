// import { SOMETHING_WENT_WRONG, USER_TYPE } from "./constans.ts";
import USER_TYPE from "./constans";
export const checkIfUserCanAccessThisRoute = (
  accessLevel: string,
  userDetails: any
) => {
  switch (accessLevel) {
    // case USER_TYPE.optional:
    //   return [true];

    case USER_TYPE.shouldAuthenticated:
      if (userDetails.id) {
        return [true];
      }
      return [false, "/login"];

    case USER_TYPE.Admin:
      if (!userDetails.id) {
        return [false, "/auth/login"];
      }

      if (!userDetails.isAdmin) {
        return [false, "/auth/login"];
      }
      return [true]

    default:
      //   setIsLoading(false);
      return [false];
  }
};