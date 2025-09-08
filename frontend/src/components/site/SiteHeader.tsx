import { Link, useNavigate, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/state/store"
import { logout } from "@/state/slices/authSlice"
import { Bell, ChevronDown, Wallet as WalletIcon, Menu, Home, Package, CreditCard, User2, Truck, HelpCircle, LogIn, UserPlus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader as SheetHdr, SheetTitle, SheetClose } from "@/components/ui/sheet"

// SiteHeader now reuses the Home dashboard navbar and wires actions.
export default function SiteHeader() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token))
  const user = useAppSelector((s) => s.auth.user)

  type Item = { label: string; to: string; icon: any }
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
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/"))

  const onLogout = () => {
    dispatch(logout())
    navigate("/", { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4">
        {/* Mobile: Hamburger menu opens sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden" variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="border-b px-4 py-4">
              <SheetHdr>
                <SheetTitle className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white font-semibold">L</div>
                  Laundrify
                </SheetTitle>
              </SheetHdr>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {items.map((it) => (
                <SheetClose asChild key={it.to}>
                  <Button
                    asChild
                    variant={isActive(it.to) ? "secondary" : "ghost"}
                    className={`justify-start gap-3 rounded-xl ${isActive(it.to) ? "bg-teal-50 text-teal-800" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <Link to={it.to}>
                      <it.icon className="h-5 w-5" /> {it.label}
                    </Link>
                  </Button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white font-semibold">L</div>
          <span className="hidden text-base font-semibold sm:inline">Laundrify</span>
        </Link>

        {/* Main nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-6">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <Link to="/orders" className="hover:text-teal-600">Orders</Link>
          <Link to="/subscriptions" className="hover:text-teal-600">Subscriptions</Link>
          <Link to="/support" className="hover:text-teal-600">Support</Link>
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {isAuthed && (
            <div className="flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm">
              <WalletIcon className="h-4 w-4" />
              <span className="font-medium">SAR 140.00</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={() => navigate(isAuthed ? "/orders" : "/login")}
          >
            <Bell className="h-5 w-5" />
          </Button>
          {isAuthed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage alt="User avatar" />
                    <AvatarFallback>
                      {(user?.name || user?.number || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/profile/edit")}>Settings</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={onLogout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
