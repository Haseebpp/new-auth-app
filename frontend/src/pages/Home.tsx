import React from "react"
import { Link } from "react-router"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Wallet as WalletIcon, ChevronDown, MapPin, Truck, ShieldCheck, Leaf, Timer, Gift, CreditCard } from "lucide-react"

/**
 * Laundry Web Dashboard — Home Screen
 * - Responsive 3-column layout: Sidebar | Main | Right rail
 * - Matches the spec you used to generate the 16:9 concept
 * - Uses shadcn/ui + Tailwind + lucide-react icons
 */

export default function LaundryDashboardHome() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      {/* Main column */}
      <main className="flex min-h-[calc(100vh-8rem)] flex-col gap-4">
          {/* Location + quick search (mobile-visible) */}
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <Button variant="outline" className="gap-2 rounded-xl">
              <MapPin className="h-4 w-4" /> Home — Riyadh <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm">
              <WalletIcon className="h-4 w-4" />
              <span className="font-medium">SAR 140.00</span>
            </div>
          </div>

          {/* Hero banner */}
          <Card className="overflow-hidden rounded-2xl border-teal-100 bg-teal-50">
            <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_280px]">
              <div className="flex flex-col gap-4">
                <div className="text-2xl font-semibold md:text-3xl">
                  Pickup in <span className="text-teal-700">2h</span> • Delivery <span className="text-teal-700">&lt; 24h</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1 rounded-full border bg-white text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-teal-600" /> Sealed Bag
                  </Badge>
                  <Badge variant="secondary" className="gap-1 rounded-full border bg-white text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-teal-600" /> Non‑mixed Loads
                  </Badge>
                  <Badge variant="secondary" className="gap-1 rounded-full border bg-white text-slate-700">
                    <Leaf className="h-4 w-4 text-emerald-600" /> Eco Wash
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild className="rounded-xl bg-teal-600 hover:bg-teal-700">
                    <Link to="/orders/new/service">Schedule Pickup</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link to="/subscriptions">Subscriptions</Link>
                  </Button>
                </div>
              </div>

              {/* Illustration placeholder */}
              <div className="relative hidden h-40 items-center justify-center md:flex">
                <LaundryIllustration />
              </div>
            </CardContent>
          </Card>

          {/* Quick actions & price row */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Schedule</CardTitle>
                <CardDescription>Book a new pickup</CardDescription>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-2xl font-semibold">SAR 6</div>
                <Truck className="h-7 w-7 text-teal-600" />
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="gap-2 rounded-xl px-0 text-teal-700 hover:bg-teal-50">
                  <Link to="/orders/new/service">
                    Schedule Pickup <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Subscriptions</CardTitle>
                <CardDescription>Weekly or monthly plans</CardDescription>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-2xl font-semibold">SAR 65</div>
                <CreditCard className="h-7 w-7 text-teal-600" />
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="gap-2 rounded-xl px-0 text-teal-700 hover:bg-teal-50">
                  <Link to="/subscriptions">
                    Explore Plans <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Bundles</CardTitle>
                <CardDescription>Save with curated sets</CardDescription>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-2xl font-semibold">SAR 9</div>
                <Gift className="h-7 w-7 text-teal-600" />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="gap-2 rounded-xl px-0 text-teal-700 hover:bg-teal-50">
                  View Bundles <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
              <PriceCard label="Thobe" price="SAR 6" icon={<ShirtIcon />} />
              <PriceCard label="Standard Wash (6kg)" price="SAR 65" icon={<WashIcon />} />
              <PriceCard label="Abaya" price="SAR 9" icon={<AbayaIcon />} />
            </CardContent>
          </Card>
      </main>

      {/* Right rail */}
      <aside className="flex flex-col gap-4">
          {/* Active Order Tracker */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Active Order</CardTitle>
              <CardDescription>Order #A41X • Today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Step label="Pickup" done />
              <Step label="Processing" active />
              <Step label="QC" />
              <Step label="Delivery" />
              <Step label="Done" />
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-slate-600"><Timer className="h-4 w-4" /> ETA</span>
                <span className="font-medium">Today, 2:30 pm</span>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button className="rounded-xl" variant="outline">Contact Driver</Button>
              <Button className="rounded-xl" variant="default">Support Chat</Button>
            </CardFooter>
          </Card>

          {/* Loyalty & Referral */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Wallet & Loyalty</CardTitle>
              <CardDescription>Balance • Referrals • Tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Wallet Balance</div>
                <div className="text-lg font-semibold">SAR 140.00</div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Tier: <span className="font-medium">Silver</span></span>
                  <span>Next: Gold</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <Button className="w-full rounded-xl" variant="secondary"><Gift className="mr-2 h-4 w-4" /> Invite & Earn 25 SAR</Button>
            </CardContent>
          </Card>
      </aside>
    </div>
  )
}

/* ---------------------------- UI Subcomponents ---------------------------- */

function Step({ label, active, done }: { label: string; active?: boolean; done?: boolean }) {
  const state = done ? "bg-teal-600" : active ? "bg-teal-400" : "bg-slate-200"
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2.5 w-2.5 rounded-full ${state}`} />
      <span className={`text-sm ${done ? "text-slate-500 line-through" : active ? "font-medium" : "text-slate-700"}`}>{label}</span>
    </div>
  )
}

function PriceCard({ label, price, icon }: { label: string; price: string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">{icon}</div>
          <div>
            <div className="text-sm text-slate-600">{label}</div>
            <div className="text-base font-semibold">{price}</div>
          </div>
        </div>
        <Button variant="ghost" className="rounded-xl">Add</Button>
      </CardContent>
    </Card>
  )
}

/* Simple placeholder SVGs so the page looks complete without external images */
function LaundryIllustration() {
  return (
    <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#5eead4" />
        </linearGradient>
      </defs>
      <rect x="0" y="20" width="240" height="100" rx="16" fill="url(#g1)" opacity="0.2" />
      <g transform="translate(40,30)">
        <rect width="160" height="80" rx="14" fill="#0d9488" opacity="0.15" />
        <rect x="10" y="10" width="140" height="60" rx="12" fill="#14b8a6" opacity="0.25" />
        <circle cx="60" cy="40" r="18" fill="#0ea5a4" opacity="0.45" />
        <circle cx="100" cy="40" r="18" fill="#0ea5a4" opacity="0.35" />
      </g>
    </svg>
  )
}

function ShirtIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 3l3 2 3-2 3 3-3 2v11H9V8L6 6l3-3z" />
    </svg>
  )
}

function WashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18l-1 12H4L3 6z" />
      <path d="M7 10c1.5 1 3 1 4.5 0S15 9 17 10" />
    </svg>
  )
}

function AbayaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 3h6l3 8-3 10H9L6 11 9 3z" />
    </svg>
  )
}
