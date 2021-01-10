export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.authenticationToken) {
    return { Authorization: "Bearer " + user.authenticationToken };
  } else {
    return {};
  }
}
