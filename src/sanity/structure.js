export const singletonDocumentTypes = new Set([]);

export function structure(S) {
  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Banner")
        .child(S.documentTypeList("siteBanner").title("Site Banners")),
      S.divider(),
      S.documentTypeListItem("event").title("Events"),
    ]);
}
