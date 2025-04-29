import FileUploadComponent from '@/app/components/file-upload';

export default function Home() {
  return (
    <div>
      <div className="flex min-h-screen w-screen">
        <div className="flex min-h-screen w-[30vw] items-center justify-center p-4">
          <FileUploadComponent />
        </div>
        <div className="min-h-screen w-[70vw] border-l-2">2</div>
      </div>
    </div>
  );
}
