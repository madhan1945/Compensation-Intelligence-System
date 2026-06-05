export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div>Company Page Stub for Slug: {slug}</div>;
}
