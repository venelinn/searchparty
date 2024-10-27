import { createClient } from "contentful";

export async function getRCLMessages(locale) {
  const clientRCL = createClient({
    accessToken: process.env.CONTENTFUL_RCL_ACCESS_TOKEN,
    space: process.env.CONTENTFUL_RCL_SPACE_ID,
    environment: process.env.CONTENTFUL_RCL_ENVIRONMENT,
  });

  let rclData;
  if (locale === "fr") {
    rclData = await clientRCL.getEntries({
      content_type: "applicationResources",
      locale: "fr",
    });
  } else {
    rclData = await clientRCL.getEntries({
      content_type: "applicationResources",
      locale: "en-US",
    });
  }

  const rclMessages = rclData.items
    .filter((item) => {
      const applications = item.fields.application;
      if (applications && applications.length > 0) {
        const firstApplication = applications[0];
        const code = firstApplication.fields.application3charCode;
        return code === "SVG";
      }
      return false;
    })
    .map((item) => {
      return {
        ...item,
        locale: locale,
      };
    });

  return rclMessages;
}
