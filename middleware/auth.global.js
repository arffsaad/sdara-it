export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie("pb_auth");
  
  // Add auth protected routes here
  const mustAuth = [
    "/members",
    "/profile"
  ]

  // Add routes that must not be authed here (login, register, etc.)
  const mustNotAuth = [
    "/login",
    "/register",
  ]

  if (mustAuth.includes(to.path) && cookie.value?.token == "") {
    return "/login";
  } else if (mustNotAuth.includes(to.path) && cookie.value?.token != "") {
    return "/";
  } else {
    return;
  }
  // must not auth
})