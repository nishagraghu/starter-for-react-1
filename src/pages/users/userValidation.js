import * as Yup from "yup";

export const createUserSchema = Yup.object({
  name: Yup.string().min(1).max(128).required("Name is required"),
  email: Yup.string().email("Invalid email").max(255).required("Email is required"),
  password: Yup.string().min(8).max(128).required("Password is required"),
  phone: Yup.string().max(30).nullable().transform((v) => (v === "" ? null : v)),
  roleId: Yup.string().max(36).nullable().transform((v) => (v === "" ? null : v)),
});

export const updateUserSchema = Yup.object({
  name: Yup.string().min(1).max(128),
  email: Yup.string().email("Invalid email").max(255),
  phone: Yup.string().max(30).nullable().transform((v) => (v === "" ? null : v)),
}).test("at-least-one", "At least one field must be provided", (values) =>
  Object.values(values).some((v) => v !== undefined && v !== null && v !== "")
);

export const passwordSchema = Yup.object({
  password: Yup.string().min(8).max(128).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export const emailSchema = Yup.object({
  email: Yup.string().email("Invalid email").max(255).required("Email is required"),
});

export const phoneSchema = Yup.object({
  phone: Yup.string().max(30).nullable().transform((v) => (v === "" ? null : v)),
});

export const labelsSchema = Yup.object({
  labels: Yup.array().of(Yup.string().max(100)).required(),
});
