import "../styles/globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ padding: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
