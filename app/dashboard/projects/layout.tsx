import { Sora } from "next/font/google";

const projectFont = Sora({
  subsets: ["latin"],
  variable: "--font-project",
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${projectFont.variable} font-[family-name:var(--font-project)] text-[13px] leading-5 tracking-[0.01em]`}>
      {children}
    </div>
  );
}

