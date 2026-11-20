import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

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
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
      <div>
        <h1 className="text-4xl font-extrabold">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">
          Questions, partnerships or just saying hi — drop us a line.
        </p>
        <div className="mt-8 space-y-4">
          {[
            { i: FiMail, l: "hello@homebites.app" },
            { i: FiPhone, l: "+1 415 555 0121" },
            { i: FiMapPin, l: "500 Market St, San Francisco, CA" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full gradient-warm text-primary-foreground shadow-soft">
                <c.i />
              </div>
              <div className="font-semibold">{c.l}</div>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border/40 md:p-8"
      >
        <div>
          <label className="text-xs font-semibold">Name</label>
          <input
            {...register("name", { required: true })}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
          {errors.name && <div className="mt-1 text-xs text-destructive">Required</div>}
        </div>
        <div>
          <label className="text-xs font-semibold">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold">Message</label>
          <textarea
            rows={5}
            {...register("message", { required: true })}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <button className="w-full rounded-full gradient-warm py-3 font-bold text-primary-foreground shadow-soft hover:shadow-glow">
          Send message
        </button>
      </form>
    </div>
  );
}
