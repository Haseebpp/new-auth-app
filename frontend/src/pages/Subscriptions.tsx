import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Check, Shield, Clock, Leaf, Shirt, Users, GraduationCap } from "lucide-react"

// Subscriptions & Bundles — Main content only (Header/Footer provided by AppLayout)

const plans = [
  {
    id: "family",
    name: "Family Plan",
    subtitle: "Weekly Bulk Wash · 24kg/month",
    price: "SAR 249/month",
    popular: true,
    savings: "Save 15%",
    icon: Users,
    features: ["Weekly pickup", "Free delivery", "Ironing included"],
  },
  {
    id: "student",
    name: "Student Plan",
    subtitle: "Weekly 6kg · Perfect for students",
    price: "SAR 99/month",
    popular: false,
    savings: "Low cost",
    icon: GraduationCap,
    features: ["Weekly pickup", "Free delivery"],
  },
  {
    id: "office",
    name: "Office Staff Plan",
    subtitle: "Uniform Care · 40 items/month",
    price: "SAR 349/month",
    popular: false,
    savings: "Business-friendly",
    icon: Shirt,
    features: ["Biweekly pickup", "Ironing included", "Eco wash"],
  },
]

export default function SubscriptionsPage() {
  const [rtl, setRtl] = React.useState(false)

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="from-slate-50 to-white text-slate-900">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-2 py-2 md:px-4 md:py-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">Subscriptions & Bundles</h1>
            <p className="mt-2 max-w-xl text-slate-600">Pick a plan that suits your lifestyle. Guaranteed 24h return, hygiene by default, and real ETAs.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-teal-600"/> <strong>24h</strong> delivery</span>
              <Separator orientation="vertical" className="h-4"/>
              <span className="inline-flex items-center gap-1"><Shield className="h-4 w-4 text-teal-600"/> Sealed bag</span>
              <Separator orientation="vertical" className="h-4"/>
              <span className="inline-flex items-center gap-1"><Leaf className="h-4 w-4 text-teal-600"/> Eco options</span>
            </div>
          </div>

          {/* Loyalty Sidebar + RTL toggle */}
          <div className="flex w-full max-w-sm items-start gap-4 md:w-auto md:max-w-none md:items-stretch">
            <Card className="w-full md:w-80">
              <CardHeader>
                <CardTitle className="text-base">Gold Tier</CardTitle>
                <CardDescription>2 more orders to unlock free express</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={68} className="h-2" />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span>Current</span>
                  <span>Next reward</span>
                </div>
              </CardContent>
            </Card>
            <div className="hidden items-center gap-2 md:flex">
              <Label htmlFor="rtl" className="text-xs">RTL</Label>
              <Switch id="rtl" checked={rtl} onCheckedChange={setRtl} />
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="mx-auto max-w-7xl px-2 pb-6 md:px-4 md:pb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              {plan.popular && (
                <Badge className="absolute -top-2 start-4 bg-teal-600">Most Popular</Badge>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <plan.icon className="h-6 w-6 text-teal-700" />
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-semibold tracking-tight">{plan.price}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-teal-700">{plan.savings}</Badge>
                </div>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {plan.features.map((f) => (
                    <li key={f} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-teal-600"/>{f}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Subscribe Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto max-w-7xl px-2 pb-4 md:px-4 md:pb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compare Plans</CardTitle>
            <CardDescription>Choose the plan that fits your routine.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableCaption className="sr-only">Plan comparison</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Features</TableHead>
                    {plans.map((p) => (
                      <TableHead key={p.id} className="text-center">{p.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Kg / Items</TableCell>
                    <TableCell className="text-center">24 kg</TableCell>
                    <TableCell className="text-center">6 kg</TableCell>
                    <TableCell className="text-center">40 items</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pickup Frequency</TableCell>
                    <TableCell className="text-center">Weekly</TableCell>
                    <TableCell className="text-center">Weekly</TableCell>
                    <TableCell className="text-center">Biweekly</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ironing Included</TableCell>
                    <TableCell className="text-center">Yes</TableCell>
                    <TableCell className="text-center">—</TableCell>
                    <TableCell className="text-center">Yes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Free Delivery</TableCell>
                    <TableCell className="text-center">Yes</TableCell>
                    <TableCell className="text-center">Yes</TableCell>
                    <TableCell className="text-center">Yes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Eco Wash Option</TableCell>
                    <TableCell className="text-center">Available</TableCell>
                    <TableCell className="text-center">—</TableCell>
                    <TableCell className="text-center">Available</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
