import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import InquiryDashboardClient from '@/components/InquiryDashboardClient';

export const metadata = {
  title: 'Inquiries | Dashboard',
  description: 'Manage inquiries from potential buyers',
};

async function getInquiries(ranchId: string, status?: string) {
  const where: any = { ranchId };
  
  if (status && ['UNREAD', 'RESPONDED', 'ARCHIVED'].includes(status)) {
    where.status = status;
  }

  const inquiries = await prisma.inquiry.findMany({
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
    orderBy: {
      createdAt: 'desc',
    },
    take: 100, // Limit for performance
  });

  return inquiries;
}

async function getInquiryCounts(ranchId: string) {
  const [unreadCount, respondedCount, archivedCount] = await Promise.all([
    prisma.inquiry.count({ where: { ranchId, status: 'UNREAD' } }),
    prisma.inquiry.count({ where: { ranchId, status: 'RESPONDED' } }),
    prisma.inquiry.count({ where: { ranchId, status: 'ARCHIVED' } }),
  ]);

  return {
    unread: unreadCount,
    responded: respondedCount,
    archived: archivedCount,
    total: unreadCount + respondedCount + archivedCount,
  };
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/inquiries');
  }

  // Check if user is a ranch owner
  if (session.user.role !== 'RANCH_OWNER') {
    redirect('/dashboard');
  }

  // Get ranch for this user
  const ranch = await prisma.ranch.findUnique({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });

  if (!ranch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ranch Not Found
          </h1>
          <p className="text-gray-600">
            No ranch is associated with your account. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Fetch inquiries and counts
  const [inquiries, counts] = await Promise.all([
    getInquiries(ranch.id, searchParams.status),
    getInquiryCounts(ranch.id),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="mt-2 text-gray-600">
            Manage inquiries from potential buyers for {ranch.name}
          </p>
        </div>

        {/* Dashboard Component */}
        <InquiryDashboardClient
          inquiries={inquiries}
          counts={counts}
          currentStatus={searchParams.status}
        />
      </div>
    </div>
  );
}
