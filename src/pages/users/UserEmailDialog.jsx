import { toast } from "sonner";
import { useFormik } from "formik";
import apiClient from "../../lib/apiClient";
import { emailSchema } from "./userValidation";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Loader2, CheckCircle } from "lucide-react";

export default function UserEmailDialog({ open, onOpenChange, user, onUpdated }) {
  const formik = useFormik({
    initialValues: { email: user?.email || "" },
    validationSchema: emailSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await apiClient(`/admin/users/${user.id}/email`, {
          method: "PUT",
          body: { email: values.email },
        });
        toast.success(`Email updated for ${user.name}`);
        onUpdated?.();
        onOpenChange(false);
      } catch (err) {
        toast.error(err.message || "Failed to update email");
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function handleVerify() {
    try {
      await apiClient(`/admin/users/${user.id}/verify-email`, { method: "PUT" });
      toast.success("Email verified");
      onUpdated?.();
    } catch (err) {
      toast.error(err.message || "Failed to verify email");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
          <DialogDescription>
            Change email for <strong>{user?.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-destructive mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            {user?.emailVerification ? (
              <Badge variant="success" className="text-xs gap-1">
                <CheckCircle className="size-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">Pending</Badge>
            )}
          </div>
          <DialogFooter>
            {!user?.emailVerification && (
              <Button type="button" variant="secondary" onClick={handleVerify}>
                Verify Email
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
