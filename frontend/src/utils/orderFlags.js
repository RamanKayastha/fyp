export const isCustomizedItem = (item) =>
  item?.customized === true || Boolean(item?.previewFront || item?.previewBack)
