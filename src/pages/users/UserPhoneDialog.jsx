import { toast } from "sonner";
import { useFormik } from "formik";
import apiClient from "../../lib/apiClient";
import { phoneSchema } from "./userValidation";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Loader2, CheckCircle } from "lucide-react";

export default function UserPhoneDialog({ open, onOpenChange, user, onUpdated }) {
  const formik = useFormik({
    initialValues: { phone: user?.phone || "" },
    validationSchema: phoneSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await apiClient(`/admin/users/${user.id}/phone`, {
          method: "PUT",
          body: { phone: values.phone || "" },
        });
        toast.success(`Phone updated for ${user.name}`);
        onUpdated?.();
        onOpenChange(false);
      } catch (err) {
        toast.error(err.message || "Failed to update phone");
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function handleVerify() {
    try {
      await apiClient(`/admin/users/${user.id}/verify-phone`, { method: "PUT" });
      toast.success("Phone verified");
      onUpdated?.();
    } catch (err) {
      toast.error(err.message || "Failed to verify phone");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Phone</DialogTitle>
          <DialogDescription>
            Change phone number for <strong>{user?.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1234567890"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-destructive mt-1">{formik.errors.phone}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            {user?.phoneVerification ? (
              <Badge variant="success" className="text-xs gap-1">
                <CheckCircle className="size-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">Pending</Badge>
            )}
          </div>
          <DialogFooter>
            {!user?.phoneVerification && (
              <Button type="button" variant="secondary" onClick={handleVerify}>
                Verify Phone
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
