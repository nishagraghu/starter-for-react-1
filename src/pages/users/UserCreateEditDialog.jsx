import { toast } from "sonner";
import { useFormik } from "formik";
import apiClient from "../../lib/apiClient";
import { createUserSchema, updateUserSchema } from "./userValidation";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { Loader2 } from "lucide-react";

export default function UserCreateEditDialog({ open, onOpenChange, user, roles, onSaved }) {
  const isEdit = !!user;

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      phone: user?.phone || "",
      roleId: user?.role?.id || "",
    },
    validationSchema: isEdit ? updateUserSchema : createUserSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEdit) {
          await apiClient(`/admin/users/${user.id}`, {
            method: "PUT",
            body: { name: values.name, email: values.email, phone: values.phone },
          });
          toast.success("User updated");
        } else {
          await apiClient("/admin/users", {
            method: "POST",
            body: values,
          });
          toast.success("User created");
        }
        onSaved?.();
        onOpenChange(false);
      } catch (err) {
        toast.error(err.message || "Operation failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update user details" : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" {...formik.getFieldProps("name")} />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-destructive mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...formik.getFieldProps("email")} />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-destructive mt-1">{formik.errors.email}</p>
            )}
          </div>
          {!isEdit && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min 8 characters" {...formik.getFieldProps("password")} />
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-destructive mt-1">{formik.errors.password}</p>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1234567890" {...formik.getFieldProps("phone")} />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-destructive mt-1">{formik.errors.phone}</p>
            )}
          </div>
          <div>
            <Label>Role</Label>
            <Select
              value={formik.values.roleId}
              onValueChange={(v) => formik.setFieldValue("roleId", v)}
            >
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
