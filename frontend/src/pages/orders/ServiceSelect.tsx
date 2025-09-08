import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchServices, selectServices, selectServicesStatus } from "@/state/slices/servicesSlice";
import { setServiceId } from "@/state/slices/bookingSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, formatMinutes } from "@/lib/utils";
import { CheckCircle2, Clock, Info, Search } from "lucide-react";

export default function ServiceSelect() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const services = useAppSelector(selectServices);
  const status = useAppSelector(selectServicesStatus);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchServices());
  }, [status]);

  const onChoose = (id: string) => {
    dispatch(setServiceId(id));
    navigate("/orders/new/schedule");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      [s.name, s.description || ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [services, query]);

  const Skeleton = () => (
    <Card className="rounded-2xl border-slate-200 shadow-sm animate-pulse">
      <CardContent className="p-5">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-3 w-3/4 rounded bg-slate-100" />
        <div className="mt-6 flex items-center gap-3">
          <div className="h-6 w-16 rounded bg-slate-200" />
          <div className="h-6 w-20 rounded bg-slate-200" />
        </div>
        <div className="mt-6 h-9 w-full rounded bg-slate-200" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-8 pb-16">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Choose a Service</h1>
            <p className="text-sm text-slate-600">Select from our available wash & detailing services</p>
          </div>
          {status === "succeeded" && (
            <div className="text-sm text-slate-500">{filtered.length} of {services.length} services</div>
          )}
        </div>

        {/* Loading / Error banners */}
        {status === "loading" && (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}
        {status === "failed" && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <Info className="h-4 w-4" />
            <span>Failed to load services.</span>
            <Button variant="outline" size="sm" className="ml-auto rounded-xl" onClick={() => dispatch(fetchServices())}>
              Retry
            </Button>
          </div>
        )}

        {/* Search */}
        {status === "succeeded" && services.length > 0 && (
          <div className="mt-4 relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              className="rounded-xl pl-9"
            />
          </div>
        )}

        {status === "succeeded" && services.length === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            No services available yet. If you’re developing locally, seed the database with sample services:
            <pre className="mt-2 rounded border bg-slate-50 p-2 text-xs">npm run seed:services</pre>
            <div className="mt-2">Then refresh this page.</div>
            <div className="mt-3">
              <Button variant="outline" className="rounded-xl" onClick={() => dispatch(fetchServices())}>Retry</Button>
            </div>
          </div>
        ) : null}

        <Separator className="my-6" />

        {/* Services grid */}
        {status === "succeeded" && services.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Card
                key={s._id}
                className={cn("rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md cursor-pointer")}
                onClick={() => onChoose(s._id)}
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="text-lg">{s.name}</CardTitle>
                  <div className="text-right font-semibold text-slate-900">{formatCurrency(s.price)}</div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3 text-slate-700">
                    {s.description ? s.description : "No description"}
                  </CardDescription>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatMinutes(s.durationMinutes)}</span>
                    {s.active ? (
                      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">Active</Badge>
                    ) : (
                      <Badge className="rounded-full border bg-slate-100 text-slate-500">Inactive</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2 rounded-xl bg-teal-600 hover:bg-teal-700" onClick={(e) => { e.stopPropagation(); onChoose(s._id); }}>
                    <CheckCircle2 className="h-4 w-4" /> Select
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
