import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Plus, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const contactsData = [
  { id: 1, name: "Ken Adams", email: "ken99@yahoo.com", phone: "+1 (555) 123-4567", company: "Acme Corp", location: "New York, NY", deals: 5 },
  { id: 2, name: "Sarah Miller", email: "sarah.m@globex.com", phone: "+1 (555) 234-5678", company: "Globex", location: "San Francisco, CA", deals: 3 },
  { id: 3, name: "Mike Chen", email: "mike.c@initech.io", phone: "+1 (555) 345-6789", company: "Initech", location: "Austin, TX", deals: 2 },
  { id: 4, name: "Lisa Park", email: "lisa.park@umbrella.com", phone: "+1 (555) 456-7890", company: "Umbrella Corp", location: "Chicago, IL", deals: 8 },
  { id: 5, name: "Tom Hardy", email: "tom@stark.co", phone: "+1 (555) 567-8901", company: "Stark Industries", location: "Los Angeles, CA", deals: 4 },
  { id: 6, name: "Diana Prince", email: "diana@wayne.com", phone: "+1 (555) 678-9012", company: "Wayne Enterprises", location: "Gotham, NY", deals: 6 },
  { id: 7, name: "James Wilson", email: "jwilson@acme.com", phone: "+1 (555) 789-0123", company: "Acme Corp", location: "Boston, MA", deals: 1 },
  { id: 8, name: "Emily Davis", email: "emily.d@globex.com", phone: "+1 (555) 890-1234", company: "Globex", location: "Seattle, WA", deals: 3 },
];

export default function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground">Manage your contacts and accounts.</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
        {contactsData.slice(0, 8).map((contact) => (
          <Card key={contact.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="pt-6 text-center">
              <Avatar className="size-14 mx-auto">
                <AvatarFallback className="text-lg">
                  {contact.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium mt-3">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.company}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                {contact.deals} deals
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">All Contacts</CardTitle>
          <CardDescription>A list of all your contacts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="text-right">Deals</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactsData.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 hidden sm:flex">
                        <AvatarFallback className="text-xs">
                          {contact.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{contact.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {contact.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{contact.company}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {contact.location}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{contact.deals}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Phone className="mr-2 size-4" /> Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 size-4" /> Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
