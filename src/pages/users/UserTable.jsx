import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Pencil, Power, PowerOff, MoreHorizontal,
  Shield, Key, Mail, Phone, Tag, Monitor,
  CheckCircle, Trash2,
} from "lucide-react";

export default function UserTable({
  users,
  loading,
  onToggleStatus,
  onEdit,
  onAssignRole,
  onResetPassword,
  onUpdateEmail,
  onUpdatePhone,
  onManageLabels,
  onViewSessions,
  onVerifyEmail,
  onVerifyPhone,
  onDelete,
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden md:table-cell">Verified</TableHead>
          <TableHead className="w-24 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Loading...
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.name}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {u.email}
              </TableCell>
              <TableCell>
                <Badge variant={u.status ? "success" : "secondary"} className="text-xs">
                  {u.status ? "Active" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell>
                {u.role ? (
                  <Badge variant="outline" className="text-xs">{u.role.name}</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">No role</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {u.emailVerification ? (
                  <Badge variant="success" className="text-xs">Verified</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Pending</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost" size="icon" className="size-8"
                    onClick={() => onToggleStatus(u)}
                  >
                    {u.status ? (
                      <PowerOff className="size-3.5 text-yellow-500" />
                    ) : (
                      <Power className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="size-8"
                    onClick={() => onEdit(u)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onAssignRole(u)}>
                        <Shield className="size-4" /> Assign Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(u)}>
                        <Key className="size-4" /> Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateEmail(u)}>
                        <Mail className="size-4" /> Update Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdatePhone(u)}>
                        <Phone className="size-4" /> Update Phone
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageLabels(u)}>
                        <Tag className="size-4" /> Manage Labels
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewSessions(u)}>
                        <Monitor className="size-4" /> Sessions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!u.emailVerification && (
                        <DropdownMenuItem onClick={() => onVerifyEmail(u)}>
                          <CheckCircle className="size-4" /> Verify Email
                        </DropdownMenuItem>
                      )}
                      {!u.phoneVerification && (
                        <DropdownMenuItem onClick={() => onVerifyPhone(u)}>
                          <CheckCircle className="size-4" /> Verify Phone
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(u)}
                      >
                        <Trash2 className="size-4" /> Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
