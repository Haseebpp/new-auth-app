import { useEffect } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchOrders, selectOrders, selectOrdersStatus, cancelOrder } from "@/state/slices/ordersSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { CalendarDays, Clock, XCircle } from "lucide-react";

export default function MyOrders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const status = useAppSelector(selectOrdersStatus);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const onCancel = (id: string) => {
    if (confirm("Cancel this booking?")) dispatch(cancelOrder(id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <Link to="/orders/new/service">
          <Button>New Order</Button>
        </Link>
      </div>
      {status === "loading" && <div>Loading...</div>}
      <div className="grid gap-4">
        {orders.map((o) => {
          const start = new Date(o.scheduledAt);
          const serviceName = typeof o.service === 'string' ? o.service : o.service?.name;
          const canCancel = o.status !== 'cancelled' && start.getTime() > Date.now();
          return (
            <Card key={o._id} className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{serviceName}</span>
                  <Badge className={`${o.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} capitalize`}>
                    {o.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-1">
                <div className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" /><span>{formatDateTime(o.scheduledAt)}</span></div>
                <div className="inline-flex items-center gap-2"><Clock className="w-4 h-4" /><span>{formatDateTime(o.scheduledEndAt)}</span></div>
                {o.notes ? <div className="mt-1"><span className="text-gray-500">Notes:</span> {o.notes}</div> : null}
                <div className="pt-3">
                  <Button variant="outline" onClick={() => onCancel(o._id)} disabled={!canCancel}>
                    <XCircle className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {status === "succeeded" && orders.length === 0 && (
          <div className="text-gray-600 flex items-center gap-3">
            <span>No orders yet.</span>
            <Link to="/orders/new/service">
              <Button size="sm">New Order</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
