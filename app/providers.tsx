"use client";

import { NavigationContextProvider } from "@/context/navigationContext";
import { DataProvider } from "@/utils/DataProvider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NavigationContextProvider>
			<DataProvider>
				{children}
			</DataProvider>
		</NavigationContextProvider>
	);
}
