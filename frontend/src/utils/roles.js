export const homePathForRole = (role) => {
  if (role === 'ADMIN') return '/admin'
  if (role === 'VENDOR') return '/vendor'
  return '/'
}

export const staffBaseFromPath = (pathname) =>
  String(pathname || '').startsWith('/vendor') ? '/vendor' : '/admin'
