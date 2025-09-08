import React from "react"
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
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Calendar as CalendarIcon,
  Clock,
  X,
  RotateCcw,
  Eye,
  Filter,
  Search,
  Package,
} from "lucide-react"

/**
 * OrdersPage — redesigned to match the dashboard visuals
 * - Teal/blue primary, green accents, rounded-2xl cards, soft shadows
 * - Consistent badges, spacing, and iconography
 * - Tabs for quick filters, search, and per-card actions
 */

export default function OrdersPage() {
  const [tab, setTab] = React.useState<FilterTab>("all")
  const [q, setQ] = React.useState("")

  const filtered = SAMPLE_ORDERS.filter((o) =>
    (tab === "all" || (tab === "active" && (o.status === "pending" || o.status === "processing")) || o.status === tab) &&
    (q.trim() === "" || o.title.toLowerCase().includes(q.toLowerCase()) || (o.notes ?? "").toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Page header */}
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
            <p className="text-sm text-slate-600">Track, manage, and re-order your laundry pickups</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700">
              <Package className="h-4 w-4" /> New Order
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Filter className="h-4 w-4" /> Filters <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTab("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTab("processing")}>Processing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTab("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTab("cancelled")}>Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search & tabs */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by service or notes"
              className="rounded-xl pl-9"
            />
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)} className="w-full md:w-auto">
            <TabsList className="rounded-xl">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Separator className="my-4" />

        {/* Orders list */}
        <div className="flex flex-col gap-4 pb-16">
          {filtered.length === 0 ? (
            <EmptyState query={q} />
          ) : (
            filtered.map((o) => <OrderCard key={o.id} order={o} />)
          )}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Types --------------------------------- */

type Status = "pending" | "processing" | "completed" | "cancelled"

type FilterTab = "all" | "active" | Status

interface Order {
  id: string
  title: string
  start: string // ISO
  end: string // ISO
  notes?: string
  status: Status
}

/* ------------------------------ UI Subparts ------------------------------- */

function OrderCard({ order }: { order: Order }) {
  const { badgeText, badgeClass } = statusMeta(order.status)
  const cancellable = order.status === "pending"
  const canReorder = order.status === "completed" || order.status === "cancelled"

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">{order.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="flex items-center gap-2 text-slate-700"><CalendarIcon className="h-4 w-4" />{fmtDate(order.start)}</span>
            <span className="flex items-center gap-2 text-slate-700"><Clock className="h-4 w-4" />{fmtTime(order.start)} → {fmtTime(order.end)}</span>
          </CardDescription>
          {order.notes && (
            <div className="mt-1 text-sm text-slate-600">Notes: {order.notes}</div>
          )}
        </div>
        <Badge className={`rounded-full ${badgeClass}`}>{badgeText}</Badge>
      </CardHeader>

      <CardContent className="pt-0">
        {/* miniature stepper for visual consistency */}
        <div className="flex items-center gap-3 py-2">
          <Dot label="Pickup" active={order.status !== "cancelled"} done={order.status !== "pending" && order.status !== "cancelled"} />
          <Dot label="Processing" active={order.status === "processing"} done={order.status === "completed"} />
          <Dot label="Delivered" active={order.status === "completed"} done={order.status === "completed"} />
          {order.status === "cancelled" && <Dot label="Cancelled" danger />}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2">
        {cancellable ? (
          <Button variant="outline" className="gap-2 rounded-xl">
            <X className="h-4 w-4" /> Cancel
          </Button>
        ) : (
          <Button variant="outline" className="gap-2 rounded-xl" disabled>
            <X className="h-4 w-4" /> Cancel
          </Button>
        )}
        <Button variant="ghost" className="gap-2 rounded-xl">
          <Eye className="h-4 w-4" /> View details
        </Button>
        {canReorder && (
          <Button className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700">
            <RotateCcw className="h-4 w-4" /> Reorder
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function EmptyState({ query }: { query?: string }) {
  return (
    <Card className="rounded-2xl border-dashed">
      <CardContent className="grid place-items-center gap-2 py-14 text-center">
        <Package className="h-10 w-10 text-teal-600" />
        <div className="text-lg font-medium">No orders {query ? `matching “${query}”` : "yet"}.</div>
        <p className="max-w-md text-sm text-slate-600">Create your first pickup or adjust filters to see past orders.</p>
        <div className="mt-2">
          <Button className="rounded-xl bg-teal-600 hover:bg-teal-700">New Order</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Dot({ label, active, done, danger }: { label: string; active?: boolean; done?: boolean; danger?: boolean }) {
  const color = danger ? "bg-rose-500" : done ? "bg-teal-600" : active ? "bg-teal-400" : "bg-slate-300"
  const text = danger ? "text-rose-600" : done ? "text-slate-500 line-through" : active ? "font-medium" : "text-slate-700"
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className={`${text}`}>{label}</span>
    </div>
  )
}

/* ------------------------------- Utilities -------------------------------- */

function statusMeta(s: Status) {
  switch (s) {
    case "pending":
      return { badgeText: "Pending", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200" }
    case "processing":
      return { badgeText: "Processing", badgeClass: "bg-sky-50 text-sky-700 border border-sky-200" }
    case "completed":
      return { badgeText: "Completed", badgeClass: "bg-slate-100 text-slate-700 border border-slate-200" }
    case "cancelled":
      return { badgeText: "Cancelled", badgeClass: "bg-rose-50 text-rose-700 border border-rose-200" }
    default:
      return { badgeText: s, badgeClass: "bg-slate-100 text-slate-700" }
  }
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

/* --------------------------------- Data ----------------------------------- */

const SAMPLE_ORDERS: Order[] = [
  {
    id: "1",
    title: "Detailing",
    start: "2025-09-17T14:30:00",
    end: "2025-09-17T16:30:00",
    notes: "bxcb",
    status: "pending",
  },
  {
    id: "2",
    title: "Basic Wash",
    start: "2025-09-11T14:00:00",
    end: "2025-09-11T14:30:00",
    notes: "bxcb",
    status: "pending",
  },
  {
    id: "3",
    title: "Basic Wash",
    start: "2025-09-11T12:00:00",
    end: "2025-09-11T12:30:00",
    notes: "bxcb",
    status: "cancelled",
  },
  {
    id: "4",
    title: "Detailing",
    start: "2025-09-09T12:00:00",
    end: "2025-09-09T14:00:00",
    notes: "—",
    status: "completed",
  },
]
