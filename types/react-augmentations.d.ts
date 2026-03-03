export {};

declare module "react" {
	interface HTMLAttributes<T> {
		popover?: "" | "manual";
		popovertarget?: string;
	}
}
