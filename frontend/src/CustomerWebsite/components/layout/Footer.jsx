import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from "react-icons/fi";
import logo from "@/assets/logo.png";
import { useSelector } from "react-redux";

export function Footer() {
  const business = useSelector((state) => state.customerBusiness.business);

  return (
    <footer className="mt-24 border-t border-border/60 bg-accent/20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="HomeBites" className="w-52 h-16" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {business?.tagline ||
              "Fresh, home-style food made daily and delivered straight to your door."}
          </p>
          <div className="mt-4 flex gap-2">
            {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/help" className="hover:text-primary">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-primary">
                My Orders
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Partner with us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Ride with us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Get the app</h4>
          <p className="mb-3 text-sm text-muted-foreground">
            Order faster and track deliveries in real time.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="#"
              className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
            >
              Download for iOS
            </a>
            <a
              href="#"
              className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background"
            >
              Download for Android
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {business?.name || "HomeBites"}. Crafted with 🧡 for food
        lovers.
      </div>
    </footer>
  );
}
