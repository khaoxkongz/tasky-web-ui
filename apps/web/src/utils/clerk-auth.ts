export async function getClerkAuthToken() {
  if (import.meta.env.SSR) {
    const { auth } = await import("@clerk/tanstack-react-start/server");
    const authObject = await auth();

    return authObject.getToken();
  }

  const { getToken } = await import("@clerk/tanstack-react-start");

  return getToken();
}
