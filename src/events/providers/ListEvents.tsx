import { getEvents } from 'events/api/events';
import { IEventViewProps, INewEvent } from 'events/models/Event';
import { DateTime } from 'luxon';
import React, { Component, createContext } from 'react';

export interface IListEventsState {
  events: INewEvent[];
  init: () => void;
}

const INITIAL_STATE: IListEventsState = {
  events: [],
  init: () => {
    throw new Error('Init state was called before component was initialized');
  },
};

export const ListEventsContext = createContext(INITIAL_STATE);

class ListEvents extends Component<IEventViewProps, IListEventsState> {
  public state: IListEventsState = { ...INITIAL_STATE };

  public init = async () => await this.fetchEvents();

  public async fetchEvents() {
    const events = await getEvents({
      event_end__gte: DateTime.local().toISODate(),
      page_size: 7,
    });

    this.setState({ events });
  }

  public render() {
    const { init } = this;
    const value = { ...this.state, init };
    return <ListEventsContext.Provider value={value}>{this.props.children}</ListEventsContext.Provider>;
  }
}

export default ListEvents;
