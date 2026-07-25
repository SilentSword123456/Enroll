export default async function Results({searchParams,}: { searchParams: Promise<{ pos?: string }>; }) {
    const { pos } = await searchParams;

    return <div>Your position: {pos}</div>;
}