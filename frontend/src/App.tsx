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

// --- Example Layout Components ---
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

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
    <main className="flex-1 p-4">{children}</main>
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
]);

// --- App Root ---
export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
