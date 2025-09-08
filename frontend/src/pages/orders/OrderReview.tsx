import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectBooking, setNotes, reset as resetBooking } from "@/state/slices/bookingSlice";
import { selectServiceById, fetchServices } from "@/state/slices/servicesSlice";
import { createOrder, selectOrderCreate, clearCreateState } from "@/state/slices/ordersSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatMinutes } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";

export default function OrderReview() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const booking = useAppSelector(selectBooking);
  const service = useAppSelector(selectServiceById(booking.serviceId || ""));
  const create = useAppSelector(selectOrderCreate);

  useEffect(() => {
    if (!booking.serviceId || !booking.scheduledAt) {
      navigate("/orders/new/service", { replace: true });
      return;
    }
    if (!service) dispatch(fetchServices());
  }, [booking.serviceId, booking.scheduledAt, service]);

  useEffect(() => () => { dispatch(clearCreateState()); }, []);

  const onConfirm = () => {
    if (!booking.serviceId || !booking.scheduledAt) return;
    dispatch(createOrder({ serviceId: booking.serviceId, scheduledAt: booking.scheduledAt, notes: booking.notes }));
  };

  useEffect(() => {
    if (create.status === "succeeded" && create.last) {
      // Reset booking and navigate to orders list
      dispatch(resetBooking());
      navigate("/orders", { replace: true });
    }
  }, [create.status]);

  const dt = useMemo(() => (booking.scheduledAt ? new Date(booking.scheduledAt) : null), [booking.scheduledAt]);
  const dateLabel = dt ? dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "-";
  const timeLabel = dt ? dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "-";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[800px] px-4 pt-8 pb-16">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Review your booking</h1>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Order Summary</CardTitle>
            {service && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{service.name}</span>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-slate-700">
                <CalendarIcon className="h-4 w-4 text-teal-600" />
                <span className="text-sm">{dateLabel}, {timeLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4 text-teal-600" />
                <span className="text-sm">{service ? formatMinutes(service.durationMinutes) : "-"}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Price</p>
              <p className="text-lg font-semibold">{service ? formatCurrency(service.price, "SAR") : "-"}</p>
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-slate-700">Notes (optional)</p>
              <Textarea
                placeholder="Any special instructions"
                className="rounded-xl"
                rows={3}
                value={booking.notes || ""}
                onChange={(e) => dispatch(setNotes(e.target.value))}
              />
            </div>

            {create.status === "failed" && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <Info className="h-4 w-4" />
                <span>{typeof create.error === "string" ? create.error : (create.error?.message || "Failed to create order")}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between gap-3">
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/orders/new/schedule">Back</Link>
            </Button>
            <Button
              className="rounded-xl bg-teal-600 hover:bg-teal-700"
              onClick={onConfirm}
              disabled={create.status === "loading" || !booking.scheduledAt || !booking.serviceId}
            >
              {create.status === "loading" ? "Placing..." : "Confirm Booking"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
