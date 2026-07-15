import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Pencil, Users, Trash2 } from "lucide-react";

export default function TeamTable({ teams, loading, onEdit, onMembers, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">Members</TableHead>
          <TableHead className="hidden md:table-cell">Created</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              Loading...
            </TableCell>
          </TableRow>
        ) : teams.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              No teams found
            </TableCell>
          </TableRow>
        ) : (
          teams.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline" className="text-xs">{t.total ?? 0}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost" size="icon" className="size-8"
                    onClick={() => onEdit(t)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="size-8"
                    onClick={() => onMembers(t)}
                  >
                    <Users className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(t)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
