import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
