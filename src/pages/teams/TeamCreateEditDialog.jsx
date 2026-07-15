import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import apiClient from "../../lib/apiClient";
import { createTeamSchema, updateTeamSchema } from "./teamValidation";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2, Plus, X } from "lucide-react";

export default function TeamCreateEditDialog({ open, onOpenChange, team, onSaved }) {
  const isEdit = !!team;
  const [fullTeam, setFullTeam] = useState(null);

  useEffect(() => {
    if (open && isEdit && team) {
      apiClient(`/teams/${team.id}`).then((res) => setFullTeam(res.data)).catch(() => {});
    } else {
      setFullTeam(null);
    }
  }, [open, isEdit, team]);

  const formik = useFormik({
    initialValues: {
      name: fullTeam?.name || "",
      prefs: fullTeam?.prefs || [],
    },
    validationSchema: isEdit ? updateTeamSchema : createTeamSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEdit) {
          await apiClient(`/teams/${team.id}`, {
            method: "PUT",
            body: { name: values.name, prefs: values.prefs },
          });
          toast.success("Team updated");
        } else {
          await apiClient("/teams", {
            method: "POST",
            body: { name: values.name, prefs: values.prefs },
          });
          toast.success("Team created");
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

  function addPref() {
    formik.setFieldValue("prefs", [...formik.values.prefs, { key: "", value: "" }]);
  }

  function updatePref(index, field, val) {
    const updated = [...formik.values.prefs];
    updated[index] = { ...updated[index], [field]: val };
    formik.setFieldValue("prefs", updated);
  }

  function removePref(index) {
    formik.setFieldValue("prefs", formik.values.prefs.filter((_, i) => i !== index));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Team" : "Create Team"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update team details" : "Create a new team"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Sales Team" {...formik.getFieldProps("name")} />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-destructive mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Preferences</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPref}>
                <Plus className="size-3 mr-1" /> Add
              </Button>
            </div>
            {formik.values.prefs.length === 0 && (
              <p className="text-xs text-muted-foreground">No preferences</p>
            )}
            {formik.values.prefs.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  placeholder="Key"
                  value={p.key}
                  onChange={(e) => updatePref(i, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={p.value}
                  onChange={(e) => updatePref(i, "value", e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removePref(i)}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
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
