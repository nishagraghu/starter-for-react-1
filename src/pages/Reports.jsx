import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
} from "lucide-react";

const monthlyData = [
  { month: "Jan", revenue: 32000, deals: 95, customers: 1450 },
  { month: "Feb", revenue: 38000, deals: 110, customers: 1520 },
  { month: "Mar", revenue: 35000, deals: 102, customers: 1600 },
  { month: "Apr", revenue: 42000, deals: 125, customers: 1680 },
  { month: "May", revenue: 48000, deals: 140, customers: 1750 },
  { month: "Jun", revenue: 52000, deals: 155, customers: 1820 },
  { month: "Jul", revenue: 44000, deals: 130, customers: 1890 },
];

const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

export default function Reports() {
  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalDeals = monthlyData.reduce((sum, d) => sum + d.deals, 0);
  const avgDealSize = Math.round(totalRevenue / totalDeals);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">View analytics and performance metrics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="size-3" />
              +18.2% YTD
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deals</CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="size-3" />
              +12.1% YTD
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Deal Size</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgDealSize.toLocaleString()}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <TrendingDown className="size-3" />
              -3.1% YTD
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
          <CardDescription>Revenue breakdown by month for the current year.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyData.map((item) => (
              <div key={item.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium w-8">{item.month}</span>
                  <span className="text-muted-foreground flex-1 text-right">
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Customer Growth</CardTitle>
            <CardDescription>Total customers over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.customers.toLocaleString()}</span>
                    <Users className="size-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Deals Closed</CardTitle>
            <CardDescription>Monthly deal count.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((item) => (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.month}</span>
                    <span className="text-muted-foreground">{item.deals} deals</span>
                  </div>
                  <Progress value={(item.deals / 155) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
