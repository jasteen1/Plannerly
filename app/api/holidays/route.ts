import { NextRequest, NextResponse } from 'next/server';

// Calendarific API configuration
const CALENDARIFIC_API_KEY = process.env.CALENDARIFIC_API_KEY || 'your-api-key-here';
const CALENDARIFIC_BASE_URL = 'https://calendarific.com/api/v2/holidays';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

  if (!year) {
    return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 });
  }

  try {
    // Fetch Philippine holidays from Calendarific API
    const response = await fetch(
      `${CALENDARIFIC_BASE_URL}?api_key=${CALENDARIFIC_API_KEY}&country=PH&year=${year}`
    );

    if (!response.ok) {
      throw new Error(`Calendarific API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to a cleaner format
    const holidays = data.response.holidays.map((holiday: any) => ({
      id: holiday.name,
      name: holiday.name,
      date: holiday.date.iso,
      type: holiday.type[0] || 'Official',
      description: holiday.description || '',
      isOfficial: true,
    }));

    return NextResponse.json({ holidays });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    );
  }
}
