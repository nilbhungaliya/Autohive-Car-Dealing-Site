import { DashboardDataType } from "@/app/admin/dashboard/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import {
  CarIcon,
  PoundSterling,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Suspense, use } from "react";

type KpiCardDataProps = {
  data: DashboardDataType;
};

interface DashboardItem {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  amount: number;
  percentage: number;
  style: Intl.NumberFormatOptions["style"];
}

const KpiCardsContent = (props: KpiCardDataProps) => {
  const { data } = props;

  const {
    totalSales,
    carsSoldThisMonth,
    newCustomersThisMonth,
    conversionRate,
    conversionRatePercentageChange,
    salesPercentageChange,
    carsSoldPercentageChange,
    newCustomersPercentageChange,
  } = use(data);

  const dashboardData: DashboardItem[] = [
    {
      id: 1,
      title: "Total Sales",
      description: "Total sales revenue in the last 30 days",
      icon: PoundSterling,
      amount: totalSales,
      percentage: Math.round(salesPercentageChange),
      style: "currency",
    },
    {
      id: 2,
      title: "Cars Sold",
      description: "Total number of cars sold in the last 30 days",
      icon: CarIcon,
      amount: carsSoldThisMonth,
      percentage: Math.round(carsSoldPercentageChange),
      style: "decimal",
    },
    {
      id: 3,
      title: "New Customers",
      description: "Total number of new customers in the last 30 days",
      icon: UsersIcon,
      amount: newCustomersThisMonth,
      percentage: Math.round(newCustomersPercentageChange),
      style: "decimal",
    },
    {
      id: 4,
      title: "Conversion Rate",
      description: "% of sales in the last 30 days",
      icon: TrendingUpIcon,
      amount: conversionRate,
      percentage: Math.round(conversionRatePercentageChange),
      style: "percent",
    },
  ];

  return (
    <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
      {dashboardData.map((item) => (
        <KPICard key={item.id} {...item} />
      ))}
    </div>
  );
};

export const KpiCards = (props: KpiCardDataProps) => {
  return (
    <Suspense fallback={
      <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((id) => (
          <Card key={id} className="bg-card border-border animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-y-1">
                <div className="h-6 w-24 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
              <div className="h-6 w-6 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    }>
      <KpiCardsContent {...props} />
    </Suspense>
  );
};

const KPICard = (props: DashboardItem[][number]) => {
  const { icon: Icon, ...rest } = props;

  return (
    <Card key={rest.id} className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-foreground">{rest.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {rest.description}
          </CardDescription>
        </div>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-bold text-foreground">
          {rest.style === "currency"
            ? formatPrice({ price: rest.amount, currency: "GBP" })
            : formatNumber(rest.amount, {
                style: rest.style,
                currency: "GBP",
                maximumFractionDigits: 0,
              })}
        </span>

        <p
          className={cn(
            "text-xs",
            !rest.percentage && "!text-muted-foreground",
            rest.percentage > 0 ? "text-green-500" : rest.percentage < 0 ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {rest.percentage === 0
            ? `${rest.percentage}%`
            : formatNumber(rest.percentage / 100, {
                style: "percent",
                maximumFractionDigits: 0,
              })}
        </p>
      </CardContent>
    </Card>
  );
};
