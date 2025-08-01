export default function LoadingSpinner({name}:{name?:string}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="text-white body-regular">Loading {name}...</div>
      </div>
    </div>
  );
} 