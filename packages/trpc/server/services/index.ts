import UserService from "@repo/services/user";
import { createForm, getFormById } from "@repo/services/form";

export const userService = new UserService();
export { createForm, getFormById };
