export default async function SeriesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className='text-center py-20 text-gray-500'>
      아직 시리즈가 없습니다.
    </div>
  );
}
