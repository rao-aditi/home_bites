import { faqs } from "@/data/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { FiSend, FiMessageCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpPage() {
  const [msgs, setMsgs] = useState([
    { me: false, text: "Hi! I'm Foodly Support. How can I help today?" },
  ]);
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { me: true, text }]);
    setText("");
    setTimeout(
      () =>
        setMsgs((m) => [
          ...m,
          { me: false, text: "Thanks! A support agent will reach out shortly." },
        ]),
      800,
    );
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-extrabold">Help & support</h1>
        <p className="mt-2 text-muted-foreground">Find answers or chat with our team.</p>
        <div className="mt-6">
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`${i}`}
                className="mb-3 rounded-2xl border-none bg-card px-5 shadow-soft"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <div>
            <a href="#" className="font-semibold hover:text-primary">
              Terms & Conditions
            </a>
          </div>
          <div>
            <a href="#" className="font-semibold hover:text-primary">
              Privacy Policy
            </a>
          </div>
          <div>
            <a href="#" className="font-semibold hover:text-primary">
              Refund Policy
            </a>
          </div>
        </div>
      </div>

      <div className="flex h-[560px] flex-col overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border/40">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="grid h-10 w-10 place-items-center rounded-full gradient-warm text-primary-foreground">
            <FiMessageCircle />
          </div>
          <div>
            <div className="font-bold">Live chat</div>
            <div className="text-xs text-success">● Online</div>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <AnimatePresence>
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.me ? "justify-end" : ""}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.me ? "gradient-warm text-primary-foreground" : "bg-accent"}`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button className="grid h-10 w-10 place-items-center rounded-full gradient-warm text-primary-foreground">
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
}
