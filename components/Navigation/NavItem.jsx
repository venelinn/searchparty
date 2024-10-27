import { useRouter } from "next/router";
import cx from "classnames";
import Link from "next/link";

export default function NavItem({
  href,
  title,
  onClick,
  className,
}) {
  const router = useRouter();
  const isActive = router.asPath === href;
  return (
		<Link
			href={href}
			className={cx("link",{
				[className]: isActive,
			})}
			onClick={onClick}
		>
			<span className="link__text">{title}</span>
		</Link>
  );
}
