import FileUploadComponent from '@/app/components/file-upload';

export default function Home() {
  return (
    <div>
      <div className="flex min-h-screen">
        <div className="flex min-h-screen w-[30vw] items-center justify-center bg-gray-50 p-4">
          <FileUploadComponent />
        </div>
        <div className="min-h-screen w-[70vw] border-l border-gray-200 p-6">2</div>
      </div>
    </div>
  );
}
