import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
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
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
      timeMax: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json(response.data.items);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Error fetching calendar events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Error creating calendar event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
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