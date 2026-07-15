import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Progress } from "../components/ui/progress";
import { MoreHorizontal, Plus, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const dealsData = [
  { id: 1, name: "Acme Corp - Enterprise", stage: "Negotiation", amount: "$48,500", probability: "85%", contact: "John Smith" },
  { id: 2, name: "Globex - Mid-Market", stage: "Proposal", amount: "$24,200", probability: "60%", contact: "Jane Doe" },
  { id: 3, name: "Initech - SMB", stage: "Qualified", amount: "$8,900", probability: "40%", contact: "Bob Wilson" },
  { id: 4, name: "Umbrella - Enterprise", stage: "Closed Won", amount: "$112,000", probability: "100%", contact: "Alice Brown" },
  { id: 5, name: "Stark Ind - Mid-Market", stage: "Lead", amount: "$32,000", probability: "20%", contact: "Tony Stark" },
  { id: 6, name: "Wayne Ent - Enterprise", stage: "Proposal", amount: "$67,300", probability: "55%", contact: "Bruce Wayne" },
];

const stageColor = {
  "Closed Won": "success",
  Negotiation: "default",
  Proposal: "warning",
  Qualified: "secondary",
  Lead: "outline",
};

export default function Deals() {
  const totalValue = dealsData.reduce((sum, d) => {
    const val = parseFloat(d.amount.replace(/[$,]/g, ""));
    return sum + val;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Deals</h1>
          <p className="text-sm text-muted-foreground">Manage your sales pipeline deals.</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" />
          New Deal
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealsData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Won This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$112,000</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="size-3" />
              +12.5%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48,817</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">All Deals</CardTitle>
          <CardDescription>A list of all deals in your pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead className="hidden sm:table-cell">Stage</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Probability</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealsData.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={stageColor[deal.stage]} className="text-xs h-5">
                      {deal.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>{deal.amount}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={parseInt(deal.probability)} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground">{deal.probability}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {deal.contact}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                        <DropdownMenuItem>Move Stage</DropdownMenuItem>
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
