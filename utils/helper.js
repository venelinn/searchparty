import Cookie from "universal-cookie";

const setCookie = (cName, cValue, cPath, cDomain, cExpiry) => {
	const cookie = new Cookie();
	cookie.set(cName, cValue, {
		path: cPath,
		domain: cDomain,
		expires: cExpiry,
	});
};

const getCookie = (cName) => {
	const cookie = new Cookie();
	return cookie.get(cName);
};

export default setCookie;
export { setCookie, getCookie };
