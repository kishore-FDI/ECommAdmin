import { Jost } from "next/font/google";
import "./globals.css";
import SessionProvider, {} from './components/SessionProvider'
import {getServerSession} from 'next-auth'
import { DataProvider } from "./components/DataContext";
const inter = Jost({ subsets: ["latin"] });

export const metadata = {
  title: "Full Stack E Commerce Admin dashboard",
  description: "Full Stack E Commerce Admin dashboard",
};

export default async function RootLayout({ children }) {
  const session =await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataProvider>
        <SessionProvider session={session}>{children}</SessionProvider>
        </DataProvider>
      </body>
    </html>
  );
}
