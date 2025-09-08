import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectBooking, setDate, setScheduledAt } from "@/state/slices/bookingSlice";
import { fetchServices, selectServiceById, fetchServiceSlots, selectSlotsFor, selectSlotsStatus } from "@/state/slices/servicesSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatMinutes } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react";

function toISODate(d: Date) {
  // Return local YYYY-MM-DD to avoid timezone off-by-one issues
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[900px] px-4 pt-8 pb-16">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-slate-600">Pick a date and choose an available time slot</p>
          {service && (
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-700">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-teal-600" /> {formatMinutes(service.durationMinutes)}</span>
              <span className="font-medium">{formatCurrency(service.price)}</span>
            </div>
          )}
        </div>

        {/* Date navigation */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => changeDay(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-slate-800">
            <CalendarIcon className="h-4 w-4 text-teal-600" />
            <span className="font-medium">{localDate}</span>
          </div>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => changeDay(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-right text-xs text-slate-500">Times shown in your local timezone</p>

        <Separator className="my-6" />

        {/* Time slots */}
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            {slotsStatus === "loading" && <div className="text-sm text-slate-600">Loading slots…</div>}
            {slotsStatus === "failed" && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <Info className="h-4 w-4" />
                <span>Failed to load slots.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {slots.map((s) => {
                const dt = new Date(s.start);
                const label = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return (
                  <Button key={s.start} variant="outline" className="rounded-xl" onClick={() => onChooseSlot(s.start)}>
                    {label}
                  </Button>
                );
              })}
            </div>

            {slots.length === 0 && slotsStatus === "succeeded" && (
              <div className="mt-2 text-sm text-slate-600">No slots available for this date. Try another day.</div>
            )}

            {/* Custom picker */}
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-slate-700">Or enter a custom date & time:</p>
              <div className="flex flex-wrap items-center gap-3">
                <Input type="date" value={localDate} min={toISODate(new Date())} onChange={(e) => setLocalDate(e.target.value)} className="rounded-xl" />
                <ManualDateTimePicker onPick={(iso) => onChooseSlot(iso)} date={localDate} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-3">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate("/orders/new/service")}>Back</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function ManualDateTimePicker({ onPick, date }: { onPick: (iso: string) => void; date: string }) {
  const [time, setTime] = useState("09:00");

  const onSubmit = () => {
    const d = new Date(`${date}T${time}:00`);
    if (!isNaN(d.getTime())) onPick(d.toISOString());
  };

  return (
    <div className="flex items-center gap-2">
      <Input className="rounded-xl" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <Button className="rounded-xl bg-teal-600 hover:bg-teal-700" onClick={onSubmit}>Use</Button>
    </div>
  );
}
