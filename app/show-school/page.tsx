
import SchoolCard from '@/app/components/SchoolCard';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Define the School type
type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  image: string;
};

// This function fetches the data directly from the database
async function getSchools() {
  const schools = await prisma.school.findMany({
    // Only select the data we need to display
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      image: true,
    },
    orderBy: {
      createdAt: 'desc', // Show the newest schools first
    },
  });
  return schools;
}

// This is the main page component (it's async)
export default async function ShowSchoolsPage() {
  // Fetch the data when the page loads on the server
  const schools = await getSchools();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Registered Schools
          </h1>
          <Link href="/add-school" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Add School
          </Link>
        </div>

        {/* --- Empty State --- */}
        {schools.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-lg font-medium text-gray-900">No schools yet</h2>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new school.</p>
          </div>
        ) : (
          /* --- Responsive Grid --- */
          <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {schools.map((school: School) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
