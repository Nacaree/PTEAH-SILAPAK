export function getShareUrl(resultId, origin, pathname = "/") {
  const url = new URL(pathname, origin);
  url.search = "";
  url.hash = "";
  url.searchParams.set("result", resultId);
  return url.toString();
}
