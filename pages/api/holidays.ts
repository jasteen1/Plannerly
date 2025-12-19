import { NextApiRequest, NextApiResponse } from 'next';

// Calendarific API configuration
const CALENDARIFIC_API_KEY = process.env.CALENDARIFIC_API_KEY || 'your-api-key-here';
const CALENDARIFIC_BASE_URL = 'https://calendarific.com/api/v2/holidays';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { year } = req.query;

  if (!year || typeof year !== 'string') {
    return res.status(400).json({ error: 'Year parameter is required' });
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

    return res.status(200).json({ holidays });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return res.status(500).json({ error: 'Failed to fetch holidays' });
  }
}
