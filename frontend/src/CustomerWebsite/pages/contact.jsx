import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const inputClass =
  "mt-2 w-full rounded-md border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-primary";
const labelClass = "text-[11px] font-bold uppercase tracking-widest text-muted-foreground";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (v) => {
    console.log(v);
    toast.success("Message sent! We'll be in touch.");
    reset();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <div className="relative md:grid md:grid-cols-[19rem_1fr]">
        {/* Contact details panel: overlaps the form card on desktop */}
        <aside className="relative z-10 gradient-hero p-8 text-primary-foreground shadow-elegant md:-mr-0 md:my-10">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest">
            <span className="h-px w-8 bg-white/70" />
            Get in touch
          </div>
          <h1 className="mt-4 text-3xl font-extrabold">Get in touch</h1>
          <p className="mt-3 text-sm text-white/85">
            Questions, partnerships or just saying hi — drop us a line.
          </p>
          <div className="mt-8 space-y-5">
            {[
              { i: FiMail, l: "hello@homebites.app" },
              { i: FiPhone, l: "+1 415 555 0121" },
              { i: FiMapPin, l: "500 Market St, San Francisco, CA" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center bg-white/15">
                  <c.i />
                </div>
                <div className="text-sm font-semibold">{c.l}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Form card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="-mt-6 bg-card p-6 shadow-soft ring-1 ring-border/40 md:mt-0 md:p-12 md:pl-16"
        >
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-primary">
            <span className="h-px w-8 bg-primary" />
            Send a message
          </div>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
            Tell us what you&apos;re <span className="text-primary">working on.</span>
          </h2>
          <p className="mt-3 border-b border-border pb-6 text-sm text-muted-foreground">
            Questions, partnerships or just saying hi — drop us a line.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Name</label>
              <input {...register("name", { required: true })} className={inputClass} />
              {errors.name && <div className="mt-1 text-xs text-destructive">Required</div>}
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Message</label>
              <textarea
                rows={5}
                {...register("message", { required: true })}
                className={inputClass}
              />
            </div>
          </div>
          <button className="mt-6 bg-foreground px-8 py-3 text-sm font-bold text-background shadow-soft transition-opacity hover:opacity-90">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
