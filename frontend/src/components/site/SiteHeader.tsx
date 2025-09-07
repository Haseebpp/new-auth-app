import { Link, useNavigate } from "react-router"
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
import { Bell, ChevronDown, Wallet as WalletIcon } from "lucide-react"

// SiteHeader now reuses the Home dashboard navbar and wires actions.
export default function SiteHeader() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token))
  const user = useAppSelector((s) => s.auth.user)

  const onLogout = () => {
    dispatch(logout())
    navigate("/", { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4">
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
