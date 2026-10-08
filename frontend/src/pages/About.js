import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const photo = (id) => `/images/${id}.jpg`;

const stats = [
  { value: "500+", label: "Weddings planned" },
  { value: "24", label: "Partner venues" },
  { value: "6", label: "Cities covered" },
  { value: "4.8/5", label: "Average couple rating" },
];

const values = [
  {
    icon: "fa-hand-holding-heart",
    title: "Personal planning",
    text: "Every couple gets one planner who knows their story, budget and family traditions from the first call to the vidaai.",
  },
  {
    icon: "fa-check-circle",
    title: "Verified partners",
    text: "Each venue and vendor is visited and reviewed by our team before they are listed on Blissful Weddings.",
  },
  {
    icon: "fa-rupee-sign",
    title: "Clear pricing",
    text: "Package prices are worked out up front, so there are no surprise charges on the wedding day.",
  },
];

// Showcase of completed weddings (demo content)
const events = [
  {
    couple: "Aanya & Rohan",
    venue: "Hawa Mahal Heritage Haveli",
    city: "Jaipur",
    date: "February 2026",
    guests: 420,
    image: photo("1587271636175-90d58cdad458"),
    quote: "A royal baraat, folk music in the courtyard and not a single thing for us to worry about.",
  },
  {
    couple: "Priya & Arjun",
    venue: "Sunset Cabana Beach Resort",
    city: "Goa",
    date: "December 2025",
    guests: 180,
    image: photo("1571003123894-1f0594d2b5d9"),
    quote: "Barefoot pheras at sunset were exactly what we dreamed of.",
  },
  {
    couple: "Sana & Faizan",
    venue: "Rajmahal Banquet Hall",
    city: "Kanpur",
    date: "November 2025",
    guests: 550,
    image: photo("1510076857177-7470076d4098"),
    quote: "The team handled the nikah, reception and 550 guests without a hitch.",
  },
  {
    couple: "Meera & Kabir",
    venue: "Lakeview Hills Retreat",
    city: "Udaipur",
    date: "January 2026",
    guests: 120,
    image: photo("1596394516093-501ba68a0ba6"),
    quote: "An intimate lakeside wedding that felt completely ours.",
  },
  {
    couple: "Ishita & Dev",
    venue: "Orchard Valley Lawns",
    city: "Agra",
    date: "March 2026",
    guests: 800,
    image: photo("1522673607200-164d1b6ce486"),
    quote: "Our huge family fit comfortably, and the decor was stunning.",
  },
  {
    couple: "Nikita & Aman",
    venue: "Crystal Banquet & Convention",
    city: "Lucknow",
    date: "April 2026",
    guests: 450,
    image: photo("1519167758481-83f550bb49b3"),
    quote: "The chandeliers, the food, the music - guests are still talking about it.",
  },
];

const About = () => {
  return (
    <div className="about-page">
      {/* Intro */}
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-text">
            <span className="about-eyebrow">About Us</span>
            <h1>We plan weddings the way families dream them</h1>
            <p>
              Blissful Weddings started in Lucknow with one goal: make wedding
              planning simple for couples and their families. Today we help
              couples across Uttar Pradesh, Rajasthan and Goa find the right
              venue, book trusted vendors and put everything together in one
              package.
            </p>
            <div className="about-hero-actions">
              <Link to="/package-builder" className="about-btn">
                Plan your wedding
              </Link>
              <Link to="/contact" className="about-btn about-btn-outline">
                Talk to us
              </Link>
            </div>
          </div>
          <div className="about-hero-images">
            <img
              className="about-img-main"
              src={photo("1465495976277-4387d4b0b4c6")}
              alt="Couple holding hands at their wedding"
            />
            <img
              className="about-img-small"
              src={photo("1515934751635-c81c6bc9a2d8")}
              alt="Wedding rings on a bed of roses"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="about-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <h2>Why couples choose us</h2>
          <div className="about-values-grid">
            {values.map((v) => (
              <div key={v.title} className="about-value">
                <i className={`fas ${v.icon}`}></i>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Completed events */}
      <section className="about-events">
        <div className="container">
          <h2>Weddings we have completed</h2>
          <p className="about-section-sub">
            A few of the celebrations we planned recently.
          </p>
          <div className="about-events-grid">
            {events.map((e) => (
              <article key={e.couple} className="about-event">
                <div className="about-event-img">
                  <img src={e.image} alt={`${e.couple} wedding at ${e.venue}`} loading="lazy" />
                  <span className="about-event-date">{e.date}</span>
                </div>
                <div className="about-event-body">
                  <h3>{e.couple}</h3>
                  <p className="about-event-meta">
                    <i className="fas fa-map-marker-alt"></i>
                    {e.venue}, {e.city}
                  </p>
                  <p className="about-event-meta">
                    <i className="fas fa-users"></i>
                    {e.guests} guests
                  </p>
                  <blockquote>"{e.quote}"</blockquote>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to plan your celebration?</h2>
          <p>Tell us your date, city and guest count and we will take it from there.</p>
          <Link to="/contact" className="about-btn">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
