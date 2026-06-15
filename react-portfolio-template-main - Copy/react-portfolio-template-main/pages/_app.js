import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import Cursor from "../components/Cursor";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.display = "block";
      const hideStyle = document.querySelector('style[data-next-hide-fouc]');
      if (hideStyle) hideStyle.remove();
    }
  }, []);

  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <Cursor />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
