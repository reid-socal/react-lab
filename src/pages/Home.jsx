import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <h1>Coffee R Us</h1>
      <p>The go to store for your coffee needs</p>
      <Link to="/shop" className="hero-button">
        Browse the shop
      </Link>
    </section>
  );
}
