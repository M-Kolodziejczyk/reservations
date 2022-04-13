export default function authHeader() {
  // @ts-ignore
  const token = JSON.parse(localStorage.getItem("token"));
  if (token && token.access_token) {
    return { Authorization: "Bearer " + token.access_token };
  } else {
    return { Authorization: "" };
  }
}
