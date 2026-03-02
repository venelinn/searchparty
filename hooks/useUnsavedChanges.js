"use client";

import { useEffect } from "react";

export default function useUnsavedChanges(isDirty) {
	useEffect(() => {
		const warningText =
			"You have unsaved changes - are you sure you wish to leave this page?";
		const handleWindowClose = (e) => {
			if (!isDirty) return;
			e.preventDefault();
			return (e.returnValue = warningText);
		};
		window.addEventListener("beforeunload", handleWindowClose);
		return () => {
			window.removeEventListener("beforeunload", handleWindowClose);
		};
	}, [isDirty]);
}
