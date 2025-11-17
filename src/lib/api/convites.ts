export async function getConviteCompleto(id: string | number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/convites/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}
