import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('google_tokens');

    if (!tokensCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokensCookie.value);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const { id } = await params;
    const response = await calendar.events.get({
      calendarId: 'primary',
      eventId: id,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    return NextResponse.json(
      { error: 'Error fetching calendar event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('google_tokens');

    if (!tokensCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokensCookie.value);
    oauth2Client.setCredentials(tokens);

    const { summary, description, location, colorId, visibility, start, end } = await request.json();

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
      summary,
      description,
      location,
      colorId,
      visibility: visibility === 'public' ? 'public' : 'private',
      start: { dateTime: new Date(start).toISOString() },
      end: { dateTime: new Date(end).toISOString() },
    };

    const { id } = await params;
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: id,
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: 'Error updating calendar event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('google_tokens');

    if (!tokensCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokensCookie.value);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const { id } = await params;
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: 'Error deleting calendar event' },
      { status: 500 }
    );
  }
} 