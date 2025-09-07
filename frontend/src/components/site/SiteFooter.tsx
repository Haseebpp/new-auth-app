import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Footer replaced to match the provided design snippet
export default function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Need help?</h3>
          <p className="text-sm text-slate-600">
            Check FAQs or reach out on chat/WhatsApp. Rewash within 48h if you’re not satisfied.
          </p>
          <div className="flex gap-2 pt-1">
            <Button variant="secondary">Open FAQ</Button>
            <Button variant="outline">Contact Support</Button>
          </div>
        </div>
        <div className="grid gap-3 md:justify-end">
          <Label htmlFor="email" className="text-sm">
            Get updates
          </Label>
          <div className="flex max-w-sm items-center gap-2">
            <Input id="email" placeholder="you@example.com" />
            <Button className="bg-teal-600 hover:bg-teal-700">Subscribe</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
