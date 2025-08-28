import "./globals.css";
import { Space_Grotesk } from "next/font/google";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-spacegrotesk",
  display: "swap"
});

export const metadata = {
  title: "just ts vro — Script Protector",
  description: "Paste your script, get a protected raw link."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable}`}>
      <body className="font-display relative">
        <div className="body-glow" aria-hidden="true" />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const glow = document.querySelector('.body-glow');
              window.addEventListener('pointermove', (e) => {
                document.documentElement.style.setProperty('--mx', e.clientX + 'px');
                document.documentElement.style.setProperty('--my', e.clientY + 'px');
              });
            `
          }}
        />
      </body>
    </html>
  );
}
