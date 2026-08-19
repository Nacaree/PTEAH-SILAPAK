import "./globals.css";

export const metadata = {
  title: "Who Will Live Here? | Pteah Silapak",
  description:
    "A playful 15-question personality quiz from Pteah Silapak. Discover which of five housemates feels most like you.",
  openGraph: {
    title: "Who Will Live Here?",
    description: "Take the Pteah Silapak character quiz and meet your closest match.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
