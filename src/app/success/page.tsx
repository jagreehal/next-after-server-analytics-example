import Link from 'next/link';

export default function SuccessPage(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Form Submitted Successfully!
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Your form has been submitted and analytics are being tracked in the
          background.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
