import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <div className="flex min-h-screen w-screen">
        <div className="min-h-screen w-[50vw]">1</div>
        <div className="min-h-screen w-[50vw] border-l-2">2</div>
      </div>
    </div>
  );
}
