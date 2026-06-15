import Logo from "./Logo";

export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {/*<SearchBar />
      <NumResults movies={movies} /> */}
      {children}
    </nav>
  );
}
