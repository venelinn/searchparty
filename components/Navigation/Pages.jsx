import NavItem from "./NavItem";

const Pages = () => {
  const items = [
		{ slug: "about", title: "About Us" },
		{ slug: "fleet", title: "Our fleet" },
		{ slug: "service", title: "Service experience" },
		{ slug: "private-jet-charters", title: "Private charters" },
		{ slug: "contact-us", title: "Contact Us" },
	];

  return (
		<ul>
			{items.map(page => (
				<li key={page.slug}>
					<NavItem href={`/${page.slug}`} title={page.title} className="link--active" />
				</li>
			))}
		</ul>
  );
}

export default Pages;
export { Pages }