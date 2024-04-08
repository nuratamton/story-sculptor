import { Rubik, Pacifico } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const fonts = {
  rubik: rubik.style.fontFamily,
  pacifico: pacifico.style.fontFamily,
};
