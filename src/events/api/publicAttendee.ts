import { get } from 'common/utils/api';
import { IPublicAttedee } from 'events/models/Attendee';

import { getUser } from 'authentication/api';

const getPublicAttendeesUrl = (eventId: number) => `/api/v1/event/attendance-events/${eventId}/public-attendees/`;

export const getPublicAttendeesForEvent = async (eventId: number) => {
  const user = await getUser();
  const attendees = await get<IPublicAttedee[]>(getPublicAttendeesUrl(eventId), { format: 'json' }, { user });
  return attendees;
};
