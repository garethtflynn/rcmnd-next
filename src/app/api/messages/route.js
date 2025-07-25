import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/libs/db";
import { broadcastMessage } from "../conversations/[id]/stream/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, recipientId } = await request.json();
    const senderId = session.user.id;

    // Validate input
    if (!content || !recipientId || !content.trim()) {
      return NextResponse.json(
        { error: "Content and recipient are required" },
        { status: 400 }
      );
    }

    // Can't message yourself
    if (senderId === recipientId) {
      return NextResponse.json(
        { error: "Cannot message yourself" },
        { status: 400 }
      );
    }

    // Check if conversation already exists between these users
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participantIDs: { has: senderId } },
          { participantIDs: { has: recipientId } }
        ]
      }
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIDs: [senderId, recipientId],
          lastMessageAt: new Date(),
        }
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: senderId,
        conversationId: conversation.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    });

    // Broadcast the new message to connected clients
    broadcastMessage(conversation.id, message);

    return NextResponse.json({
      message: "Message sent successfully",
      conversationId: conversation.id,
      messageData: message
    });

  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Retrieve user's conversations
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participantIDs: { has: userId }
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
              }
            }
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    // Format conversations to include other participant info
    const formattedConversations = conversations.map(conv => ({
      ...conv,
      otherParticipant: conv.participants.find(p => p.id !== userId),
      lastMessage: conv.messages[0] || null
    }));

    return NextResponse.json({ conversations: formattedConversations });

  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}