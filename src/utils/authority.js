export function getAuthority() {
  const authorityString = localStorage.getItem('ems-user-authority');
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  if (authority) {
    const proAuthority = typeof authority === 'string' ? [authority] : authority;
    return localStorage.setItem('ems-user-authority', JSON.stringify(proAuthority));
  }
  return localStorage.removeItem('ems-user-authority');
}
