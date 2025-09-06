import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectBooking, setDate, setScheduledAt } from "@/state/slices/bookingSlice";
import { fetchServices, selectServiceById, fetchServiceSlots, selectSlotsFor, selectSlotsStatus } from "@/state/slices/servicesSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatMinutes } from "@/lib/utils";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react";

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function ScheduleSelect() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const booking = useAppSelector(selectBooking);
  const service = useAppSelector(selectServiceById(booking.serviceId || ""));
  const [localDate, setLocalDate] = useState(booking.date || toISODate(new Date()));
  const slots = useAppSelector(selectSlotsFor(booking.serviceId || "", localDate));
  const slotsStatus = useAppSelector(selectSlotsStatus);

  useEffect(() => {
    if (!booking.serviceId) {
      navigate("/orders/new/service", { replace: true });
      return;
    }
    if (!service) dispatch(fetchServices());
  }, [booking.serviceId, service]);

  useEffect(() => {
    if (booking.serviceId && localDate) {
      dispatch(fetchServiceSlots({ serviceId: booking.serviceId, date: localDate }));
      dispatch(setDate(localDate));
    }
  }, [booking.serviceId, localDate]);

  const onChooseSlot = (iso: string) => {
    dispatch(setScheduledAt(iso));
    navigate("/orders/new/review");
  };

  const title = useMemo(() => service?.name || "Select schedule", [service]);

  const changeDay = (delta: number) => {
    const d = new Date(localDate);
    d.setDate(d.getDate() + delta);
    const iso = d.toISOString().slice(0, 10);
    setLocalDate(iso);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="mt-2 text-sm text-gray-600">Pick a date and choose an available time slot.</div>
        {service && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              <Clock className="w-3.5 h-3.5 mr-1" /> {formatMinutes(service.durationMinutes)}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              {formatCurrency(service.price)}
            </Badge>
          </div>
        )}
      </header>

      <div className="flex items-center gap-3 mb-3">
        <Button variant="outline" size="icon" onClick={() => changeDay(-1)}><ChevronLeft className="w-4 h-4" /></Button>
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="w-4 h-4" />
          <input
            type="date"
            value={localDate}
            min={toISODate(new Date())}
            onChange={(e) => setLocalDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => changeDay(1)}><ChevronRight className="w-4 h-4" /></Button>
        <div className="ml-auto text-xs text-gray-500">Times shown in your local timezone</div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="py-4">
          {slotsStatus === "loading" && <div className="text-sm text-gray-600">Loading slots…</div>}
          {slotsStatus === "failed" && (
            <div className="flex items-center gap-2 text-red-600 text-sm border border-red-200 bg-red-50 rounded p-3">
              <Info className="w-4 h-4" />
              <span>Failed to load slots.</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {slots.map((s) => {
              const dt = new Date(s.start);
              const label = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              return (
                <Button key={s.start} variant="outline" onClick={() => onChooseSlot(s.start)} className="justify-center">
                  {label}
                </Button>
              );
            })}
          </div>

          {slots.length === 0 && slotsStatus === "succeeded" && (
            <div className="mt-2 text-sm text-gray-600">No slots available for this date. Try another day.</div>
          )}

          {/* Fallback manual input */}
          <div className="mt-6">
            <div className="text-sm mb-2">Or enter a custom date & time:</div>
            <ManualDateTimePicker onPick={(iso) => onChooseSlot(iso)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ManualDateTimePicker({ onPick }: { onPick: (iso: string) => void }) {
  const [date, setDate] = useState(toISODate(new Date()));
  const [time, setTime] = useState("09:00");

  const onSubmit = () => {
    const d = new Date(`${date}T${time}:00`);
    // Normalize to ISO; backend expects ISO string
    if (!isNaN(d.getTime())) onPick(d.toISOString());
  };

  return (
    <div className="flex items-center gap-2">
      <input className="border rounded px-2 py-1 text-sm" type="date" value={date} min={toISODate(new Date())} onChange={(e) => setDate(e.target.value)} />
      <input className="border rounded px-2 py-1 text-sm" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <Button variant="outline" onClick={onSubmit}>Use</Button>
    </div>
  );
}
