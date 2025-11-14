import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import InquiryList from '@/components/InquiryList';

export const metadata = {
  title: 'Inquiries | Dashboard',
  description: 'Manage inquiries from breeders',
};

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  // Check authentication and role
  const session = await auth();

  if (!session?.user || session.user.role !== 'RANCH_OWNER') {
    redirect('/login');
  }

  // Fetch ranch for current user
  const ranch = await prisma.ranch.findUnique({
    where: { userId: session.user.id },
  });

  if (!ranch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Ranch Found
          </h1>
          <p className="text-gray-600">
            No ranch is associated with your account.
          </p>
        </div>
      </div>
    );
  }

  // Parse query parameters
  const page = parseInt(searchParams.page || '1');
  const status = searchParams.status;
  const limit = 20;

  // Build where clause
  const where: any = { ranchId: ranch.id };
  if (status) {
    where.status = status.toUpperCase();
  }

  // Fetch inquiries with pagination
  const [inquiries, totalCount, statusCounts] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      include: {
        bull: {
          select: {
            id: true,
            name: true,
            slug: true,
            heroImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
    // Get counts for each status
    Promise.all([
      prisma.inquiry.count({
        where: { ranchId: ranch.id, status: 'UNREAD' },
      }),
      prisma.inquiry.count({
        where: { ranchId: ranch.id, status: 'RESPONDED' },
      }),
      prisma.inquiry.count({
        where: { ranchId: ranch.id, status: 'ARCHIVED' },
      }),
    ]).then(([unread, responded, archived]) => ({
      UNREAD: unread,
      RESPONDED: responded,
      ARCHIVED: archived,
    })),
  ]);

  // Group inquiries by status
  const groupedInquiries = {
    UNREAD: inquiries.filter((i) => i.status === 'UNREAD'),
    RESPONDED: inquiries.filter((i) => i.status === 'RESPONDED'),
    ARCHIVED: inquiries.filter((i) => i.status === 'ARCHIVED'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-gray-700">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900">Inquiries</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage inquiries from breeders about your bulls
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InquiryList
          groupedInquiries={groupedInquiries}
          statusCounts={statusCounts}
          totalCount={totalCount}
          currentPage={page}
          pageSize={limit}
        />
      </div>
    </div>
  );
}
