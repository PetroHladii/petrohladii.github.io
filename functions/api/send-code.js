export async function onRequestPost(context) {
  const { env } = context;

  if (!env.USERST) {
    return new Response("NO USERST", { status: 500 });
  }

  return new Response("OK");
}