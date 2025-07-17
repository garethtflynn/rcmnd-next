// src/app/api/favorites/route.js GET all favorite posts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/libs/prisma';

export async function GET(request) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's favorite posts with full post details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favoritePosts: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            },
            // list: {
            //   select: {
            //     id: true,
            //     title: true // assuming your List model has a title field
            //   }
            // }
          },
          orderBy: {
            createdAt: 'desc' // Most recently favorited first
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      favorites: user.favoritePosts,
      total: user.favoritePosts.length 
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
