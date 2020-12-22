function pageCountString(pageCount) {
    if (pageCount <= 1) {
      return `${pageCount} page`
    } else {
      return `${pageCount} pages`
    }
}

export { pageCountString }