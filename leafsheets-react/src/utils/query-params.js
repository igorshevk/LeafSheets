function buildQueryParams(params) {
  var esc = encodeURIComponent;
  var queryParams = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  return queryParams
}

export { buildQueryParams }