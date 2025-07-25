import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/libs/db";

// Store active connections
const connections = new Map();

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.id;
    const userId = session.user.id;

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || !conversation.participantIDs.includes(userId)) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 403 }
      );
    }

    // Create Server-Sent Events stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
        
        // Store this connection
        const connectionId = `${conversationId}-${userId}-${Date.now()}`;
        connections.set(connectionId, {
          controller,
          conversationId,
          userId
        });

        // Set up cleanup on close
        request.signal.addEventListener('abort', () => {
          connections.delete(connectionId);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });

  } catch (error) {
    console.error("Error setting up message stream:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to broadcast new messages to connected clients
export function broadcastMessage(conversationId, messageData) {
  for (const [connectionId, connection] of connections.entries()) {
    if (connection.conversationId === conversationId) {
      try {
        connection.controller.enqueue(
          `data: ${JSON.stringify({ 
            type: 'new_message', 
            message: messageData 
          })}\n\n`
        );
      } catch (error) {
        // Connection might be closed, remove it
        connections.delete(connectionId);
      }
    }
  }
}