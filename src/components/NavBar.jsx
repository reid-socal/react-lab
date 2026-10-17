import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <NavLink to="/" end className="nav-link nav-left">
        Home
      </NavLink>
      <NavLink to="/shop" className="nav-link nav-center">
        Shop
      </NavLink>
      <NavLink to="/admin" className="nav-link nav-right">
        Admin Portal
      </NavLink>
    </nav>
  );
}
