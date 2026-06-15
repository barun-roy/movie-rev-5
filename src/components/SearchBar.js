import { useEffect, useRef } from "react";
import { useKey } from "../hooks/useKey";

export default function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  useEffect(() => {
    function callback(e) {
      if (e.code === "Enter") {
        if (document.activeElement === inputEl.current) return;
        inputEl.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", callback);

    return () => document.addEventListener("keydown", callback);
  }, [setQuery]);

  //  we are not supposed to select DOM in this way in React
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
