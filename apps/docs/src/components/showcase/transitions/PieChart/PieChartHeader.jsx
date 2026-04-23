"use client";

import { Link } from "next-transition-router";
import { usePathname } from "next/navigation";

export default function PieChartHeader() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1  px-2 py-2">
        <Link
          href="/page-transitions/piechart"
          className={`text-xs font-medium tracking-tight px-4 py-2 rounded-md hover:text-[#DE4013] ${
            pathname === "/page-transitions/piechart"
              ? "text-[#DE4013] "
              : "text-black"
          }`}
        >
         Page 1
        </Link>
        <Link
          href="/page-transitions/piechart/page2"
          className={`text-xs font-medium tracking-tight px-4 py-2 rounded-md hover:text-[#DE4013] ${
            pathname === "/page-transitions/piechart/page2"
              ? "text-[#DE4013] "
              : "text-black"
          }`}
        >
          Page 2
        </Link>
      </div>
    </nav>
  );
}