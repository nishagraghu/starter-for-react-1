import * as Yup from "yup";

export const createTeamSchema = Yup.object({
  name: Yup.string().min(1).max(128).required("Team name is required"),
});

export const updateTeamSchema = Yup.object({
  name: Yup.string().min(1).max(128).required("Team name is required"),
});

export const addMemberSchema = Yup.object({
  userId: Yup.string().min(1).max(36).required("User ID is required"),
  roles: Yup.string(),
});
