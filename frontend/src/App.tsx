// App.tsx
import { Provider } from "react-redux";
import type { ReactElement } from "react";
import { store, useAppSelector } from "@/state/store";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

// --- Example Pages (replace with your own) ---
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileCard from "@/pages/profile/profileCard";
import ProfileEdit from "@/pages/profile/profileEdit";
import ServiceSelect from "@/pages/orders/ServiceSelect";
import ScheduleSelect from "@/pages/orders/ScheduleSelect";
import OrderReview from "@/pages/orders/OrderReview";
import MyOrders from "@/pages/orders/MyOrders";
import Subscriptions from "@/pages/Subscriptions";
import Support from "@/pages/Support";

// --- Example Layout Components ---
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SiteSidebar from "@/components/site/SiteSidebar";

// --- Auth Route Wrappers ---
function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token));
  return isAuthed ? <Navigate to="/" replace /> : children;
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token));
  return isAuthed ? children : <Navigate to="/login" replace />;
}

// --- Layout ---
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <div className="flex-1 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[240px_1fr]">
        <SiteSidebar />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      </div>
    </div>
    <SiteFooter />
  </div>
);

// --- Router ---
const router = createBrowserRouter([
  { path: "/", element: <AppLayout><Home /></AppLayout> },
  { path: "/login", element: <AppLayout><PublicOnlyRoute><Login /></PublicOnlyRoute></AppLayout> },
  { path: "/register", element: <AppLayout><PublicOnlyRoute><Register /></PublicOnlyRoute></AppLayout> },
  // --- Protected Route ---
  { path: "/profile", element: <AppLayout><ProtectedRoute><ProfileCard /></ProtectedRoute></AppLayout> },
  { path: "/profile/edit", element: <AppLayout><ProtectedRoute><ProfileEdit /></ProtectedRoute></AppLayout> },
  // --- Booking Flow ---
  { path: "/orders", element: <AppLayout><ProtectedRoute><MyOrders /></ProtectedRoute></AppLayout> },
  { path: "/orders/new/service", element: <AppLayout><ProtectedRoute><ServiceSelect /></ProtectedRoute></AppLayout> },
  { path: "/orders/new/schedule", element: <AppLayout><ProtectedRoute><ScheduleSelect /></ProtectedRoute></AppLayout> },
  { path: "/orders/new/review", element: <AppLayout><ProtectedRoute><OrderReview /></ProtectedRoute></AppLayout> },
  // --- Subscriptions ---
  { path: "/subscriptions", element: <AppLayout><ProtectedRoute><Subscriptions /></ProtectedRoute></AppLayout> },
  // --- Support & Help (public)
  { path: "/support", element: <AppLayout><Support /></AppLayout> },
]);

// --- App Root ---
export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
