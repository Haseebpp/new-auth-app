import { Link, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import { Home, Package, CreditCard, User2, Truck, LogIn, UserPlus, HelpCircle } from "lucide-react"
import { useAppSelector } from "@/state/store"

type Item = {
  label: string
  to: string
  icon: any
}

export default function SiteSidebar() {
  const { pathname } = useLocation()
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token))

  const authedItems: Item[] = [
    { label: "Home", to: "/", icon: Home },
    { label: "Orders", to: "/orders", icon: Package },
    { label: "New Order", to: "/orders/new/service", icon: Truck },
    { label: "Subscriptions", to: "/subscriptions", icon: CreditCard },
    { label: "Support", to: "/support", icon: HelpCircle },
    { label: "Profile", to: "/profile", icon: User2 },
  ]

  const publicItems: Item[] = [
    { label: "Home", to: "/", icon: Home },
    { label: "Login", to: "/login", icon: LogIn },
    { label: "Register", to: "/register", icon: UserPlus },
    { label: "Support", to: "/support", icon: HelpCircle },
  ]

  const items = isAuthed ? authedItems : publicItems

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/"
    return pathname === to || pathname.startsWith(to + "/")
  }

  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-16 flex flex-col gap-1">
        {items.map((it) => (
          <Button
            key={it.to}
            asChild
            variant={isActive(it.to) ? "secondary" : "ghost"}
            className={`justify-start gap-3 rounded-xl ${
              isActive(it.to) ? "bg-teal-50 text-teal-800" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Link to={it.to}>
              <it.icon className="h-5 w-5" /> {it.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
