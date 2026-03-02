"use client";

import { usePathname } from "next/navigation";
import cx from "clsx";
import Link from "next/link";

interface NavItemProps {
  href: string;
  title: string;
  onClick?: () => void;
  className?: string;
}

export default function NavItem({
  href,
  title,
  onClick,
  className,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
		<Link
			href={href}
			className={cx("link", className ? { [className]: isActive } : {})}
			onClick={onClick}
		>
			<span className="link__text">{title}</span>
		</Link>
  );
}
