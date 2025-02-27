import { trackEvent } from './actions';
import { redirect } from 'next/navigation';

export default function Home(): React.ReactElement {
  async function handleSubmit(formData: FormData) {
    'use server';

    const email = formData.get('email') as string;
    console.log('Form submitted with email:', email);

    await trackEvent('form_submitted', email || 'anonymous_user');

    redirect('/success');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Server Analytics Example
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          A demonstration of Next.js 15 next/after for server-side analytics
        </p>

        <div className="mt-8 max-w-md mx-auto">
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-left mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            When you submit this form, analytics will be tracked on the server
            side after the response is sent to the client.
          </p>
        </div>
      </div>
    </div>
  );
}
