import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, MessageCircle, Phone, Upload, HelpCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router";

/**
 * Support & Help Screen Skeleton (Web + Mobile responsive)
 * - shadcn/ui + TailwindCSS
 * - Two-column layout on desktop, stacked on mobile
 * - FAQ accordion, Contact panel, Report Issue form
 * - Bottom nav (mobile) placeholder
 *
 * Notes:
 * - Wire in your chat provider/WhatsApp deep link/call intent inside the button onClick handlers.
 * - Replace placeholders with real copy, validation, and API calls.
 * - RTL: toggle `dir="rtl"` on the root wrapper when Arabic is active.
 */

export default function SupportHelpScreen() {
  // Placeholder handlers
  const handleChat = () => console.log("Open in-app chat");
  const handleWhatsApp = () => console.log("Open WhatsApp");
  const handleCall = () => console.log("Call support");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit issue report");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" /* dir="rtl" */>
      {/* Top App Bar (Web) */}
      <header className="sticky top-0 z-30 hidden border-b bg-white/80 backdrop-blur md:block">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5" />
            <span className="text-sm font-medium text-slate-500">Help Center</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold">Support & Help</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleChat} className="gap-2">
              <MessageSquare className="h-4 w-4" /> Chat
            </Button>
            <Button size="sm" className="gap-2" onClick={handleCall}>
              <Phone className="h-4 w-4" /> Call
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
        {/* Mobile Title */}
        <div className="mb-4 flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" className="-ml-2">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          <h1 className="text-lg font-semibold">Support & Help</h1>
        </div>

        {/* Optional tabs to switch between FAQ / Contact / Report on mobile */}
        <Tabs defaultValue="faq" className="md:hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>
          <TabsContent value="faq">
            <FAQSection />
          </TabsContent>
          <TabsContent value="contact">
            <ContactPanel onChat={handleChat} onWhatsApp={handleWhatsApp} onCall={handleCall} />
          </TabsContent>
          <TabsContent value="report">
            <ReportIssueForm onSubmit={handleSubmit} />
          </TabsContent>
        </Tabs>

        {/* Desktop two-column layout */}
        <div className="hidden gap-6 md:grid md:grid-cols-12">
          <section className="md:col-span-7 lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <FAQSection />
              </CardContent>
            </Card>
          </section>

          <aside className="md:col-span-5 lg:col-span-4 space-y-6">
            <ContactPanel onChat={handleChat} onWhatsApp={handleWhatsApp} onCall={handleCall} />
            <ReportIssueForm onSubmit={handleSubmit} />
          </aside>
        </div>
      </main>

      {/* Bottom navigation (mobile skeleton) */}
      <nav className="sticky bottom-0 z-30 border-t bg-white md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5 text-center">
          <Link to="/" className="py-3 text-xs text-slate-500">Home</Link>
          <Link to="/orders" className="py-3 text-xs text-slate-500">Orders</Link>
          <Link to="/subscriptions" className="py-3 text-xs text-slate-500">Wallet</Link>
          <Link to="/support" className="py-3 text-xs font-semibold text-teal-600">Support</Link>
          <Link to="/profile" className="py-3 text-xs text-slate-500">Profile</Link>
        </div>
      </nav>
    </div>
  );
}

/**
 * FAQ Section
 */
function FAQSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Delivery times & service windows</AccordionTrigger>
        <AccordionContent>
          We usually pick up within 2 hours and deliver under 24 hours. For express service, additional fees may apply.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Rewash policy</AccordionTrigger>
        <AccordionContent>
          If you are unhappy with the result within 48 hours, we’ll rewash free. Terms apply for special garments.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Refunds & wallet credits</AccordionTrigger>
        <AccordionContent>
          SLA breaches trigger automatic wallet credits. Refunds are handled on a case-by-case basis.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Payments & receipts</AccordionTrigger>
        <AccordionContent>
          We accept Apple Pay, Mada, and wallet. Receipts are emailed and available in your orders list.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/**
 * Contact Panel (chat / WhatsApp / call)
 */
function ContactPanel({
  onChat,
  onWhatsApp,
  onCall,
}: {
  onChat: () => void;
  onWhatsApp: () => void;
  onCall: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button variant="secondary" className="h-12 gap-2" onClick={onChat}>
            <MessageSquare className="h-5 w-5" /> Chat
          </Button>
          <Button variant="outline" className="h-12 gap-2" onClick={onWhatsApp}>
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </Button>
          <Button className="h-12 gap-2" onClick={onCall}>
            <Phone className="h-5 w-5" /> Call
          </Button>
        </div>
        <Separator className="my-4" />
        <p className="text-sm text-slate-500">
          Our team is available daily 6am–midnight. Typical response time: under 5 minutes.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Report Issue Form
 */
function ReportIssueForm({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Report an Issue</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input id="orderId" placeholder="#12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueType">Issue type</Label>
              <Select>
                <SelectTrigger id="issueType">
                  <SelectValue placeholder="Select issue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="late">Late delivery</SelectItem>
                  <SelectItem value="stain">Stain not removed</SelectItem>
                  <SelectItem value="missing">Missing item</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea id="details" placeholder="Describe the issue…" rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Attach photo</Label>
            <div className="flex items-center gap-3">
              <Input id="photo" type="file" className="cursor-pointer" />
              <Button type="button" variant="outline" className="gap-2">
                <Upload className="h-4 w-4" /> Upload
              </Button>
            </div>
          </div>

          <CardFooter className="px-0">
            <Button type="submit" className="w-full sm:w-auto">Submit Report</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
