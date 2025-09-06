import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchServices, selectServices, selectServicesStatus } from "@/state/slices/servicesSlice";
import { setServiceId } from "@/state/slices/bookingSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatMinutes } from "@/lib/utils";
import { Clock, DollarSign, Info, Search } from "lucide-react";

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
    <Card className="border-gray-200 animate-pulse">
      <CardContent className="p-4">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="mt-3 h-3 w-3/4 bg-gray-100 rounded" />
        <div className="mt-6 flex items-center gap-3">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>
        <div className="mt-6 h-9 w-24 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Choose a service</h1>
      {status === "loading" && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      )}
      {status === "failed" && (
        <div className="flex items-center gap-2 text-red-600 text-sm border border-red-200 bg-red-50 rounded p-3">
          <Info className="w-4 h-4" />
          <span>Failed to load services.</span>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => dispatch(fetchServices())}>
            Retry
          </Button>
        </div>
      )}
      {/* Search + meta */}
      {status === "succeeded" && services.length > 0 && (
        <div className="flex items-center justify-between mb-3 gap-3">
          <div className="relative w-full md:w-80">
            <input
              className="w-full border rounded pl-8 pr-3 py-2 text-sm"
              placeholder="Search services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          <div className="hidden md:block text-xs text-gray-600">{filtered.length} of {services.length} services</div>
        </div>
      )}
      {status === "succeeded" && services.length === 0 ? (
        <div className="text-gray-600 text-sm border rounded p-4 bg-gray-50">
          No services available yet. If you’re developing locally, seed the database with sample services:
          <pre className="mt-2 text-xs bg-white border rounded p-2">npm run seed:services</pre>
          <div className="mt-2">Then refresh this page.</div>
          <div className="mt-3">
            <Button variant="outline" onClick={() => dispatch(fetchServices())}>Retry</Button>
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((s) => (
          <Card key={s._id} className={cn("border-gray-200 group hover:shadow-sm transition-shadow cursor-pointer")}
            onClick={() => onChoose(s._id)}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="font-semibold">{s.name}</span>
                <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                  <DollarSign className="w-4 h-4" />
                  {formatCurrency(s.price)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {s.description ? (
                <p className="text-sm text-gray-600 line-clamp-2">{s.description}</p>
              ) : (
                <p className="text-sm text-gray-500">No description</p>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-700">
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {formatMinutes(s.durationMinutes)}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  Active
                </Badge>
              </div>

              <div className="mt-6">
                <Button size="sm">Select</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
