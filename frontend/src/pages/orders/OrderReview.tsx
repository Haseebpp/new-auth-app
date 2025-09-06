import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectBooking, setNotes, reset as resetBooking } from "@/state/slices/bookingSlice";
import { selectServiceById, fetchServices } from "@/state/slices/servicesSlice";
import { createOrder, selectOrderCreate, clearCreateState } from "@/state/slices/ordersSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, formatMinutes } from "@/lib/utils";
import { CalendarDays, Clock, Info } from "lucide-react";

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

  const local = booking.scheduledAt ? formatDateTime(booking.scheduledAt) : "";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Review your booking</h1>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Summary</span>
            {service ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">{service.name}</Badge>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-gray-500">Scheduled time</div>
              <div className="inline-flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{local}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500">Duration</div>
              <div className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{service ? formatMinutes(service.durationMinutes) : "-"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500">Price</div>
              <div>{service ? formatCurrency(service.price) : "-"}</div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-sm text-gray-700">Notes (optional)</label>
            <textarea className="mt-1 w-full border rounded p-2 text-sm" rows={3} value={booking.notes || ""} onChange={(e) => dispatch(setNotes(e.target.value))} placeholder="Any special instructions" />
          </div>

          {create.status === "failed" && (
            <div className="flex items-center gap-2 text-red-600 text-sm border border-red-200 bg-red-50 rounded p-3">
              <Info className="w-4 h-4" />
              <span>{typeof create.error === 'string' ? create.error : (create.error?.message || 'Failed to create order')}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={onConfirm} disabled={create.status === "loading"}>{create.status === "loading" ? "Placing..." : "Confirm Booking"}</Button>
            <Link to="/orders/new/schedule"><Button variant="outline">Back</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
