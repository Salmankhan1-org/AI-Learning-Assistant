export const getInlineUrl = (url) => {
  if (!url) return "";

  return url.replace(
    "/upload/",
    "/upload/fl_inline/"
  );
};
