import { Inter } from "next/font/google";
import "./globals.css";



const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "N Gram",
  description: "My instagram clone project",
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className + " bg-black text-slate-50"}>
        
        {children}
      </body>
    </html>
  );
}
