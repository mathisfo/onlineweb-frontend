import React from 'react';
import { Router, Route, Switch } from 'react-router';
import moment from 'moment';
import createBrowserHistory from 'history/createBrowserHistory';
import FilterableJobList from './FilterableJobList';
import DetailView from './DetailView';
import { IJob, IApiJob } from '../models/Job';
import { ITag, TagWrapper, TagType, Tags } from '../models/Tag';
import { IsoDateTime } from 'common/models/Date';
import { IApiCompany } from 'core/models/Company';
import { get } from 'common/utils/api';
import { getCareerOpportunities } from '../api';

const history = createBrowserHistory();

export interface IDeadlines {
  name: string;
  deadline: number;
};

const DEADLINES: IDeadlines[] = [
  {
    name: 'Maks 1 uke',
    deadline: 1000 * 60 * 60 * 24 * 7,
  },

  {
    name: 'Maks 1 måned',
    deadline: 1000 * 60 * 60 * 24 * 7 * 4,
  },
];

const getDeadlines = (deadlines: IDeadlines[]) => (
  deadlines.reduce((accumulator, deadline, index) => Object.assign(accumulator, {
    [index]: {
      id: index,
      name: deadline.name,
      deadline: deadline.deadline,
      display: false,
    },
  }), {})
);

export interface ICareerState {
  jobs: IJob[];
  tags: Tags;
  filterText: string;
};

class Career extends React.Component<{}, ICareerState> {
  defaultTags: string = '';
  constructor(props: any) {
    super(props);

    // State that will be used until data has been loaded from the server.
    this.state = {
      // List over available jobs as returned by normalizeData.
      jobs: [],

      // Stores information about a given tag, such as whether the ta
      // should be displayed in the list or not.
      tags: {
        companies: {},
        locations: {},
        jobTypes: {},

        // Deadlines are not provided by the server.
        deadlines: getDeadlines(DEADLINES),
      },

      filterText: '',
    };
  };

  async componentDidMount() {
    const { tags, jobs } = await getCareerOpportunities()
    this.setState({ tags, jobs }, () => {
      this.defaultTags = JSON.stringify(tags)
    });
  };

  // Handles a tag button being clicked by updating the state of the tag with id
  // changedTag of the specified type. If switchMode is true, all the tags in the TagContainer
  // will behave like a kind select menu - selecting one tag will blur all the other buttons.
  // This is used with the deadline tags, as selecting both 1 week and 1 month at the same
  // time makes little sense.
  handleTagChange(type: TagType, changedTag: string, switchMode: boolean) {
    this.setState((prevState: ICareerState) => {
      const tags = {} as Tags;

      Object.keys(prevState.tags).forEach((key) => {
        // If switchMode is on, all the other tags will be disabled - only one
        // tag may be enabled at once
        if (switchMode && key === type) {
          // Create a clone of the old state.
          tags[type] = Object.assign({}, prevState.tags[type]);

          Object.keys(prevState.tags[type]).forEach((tag: string) => {
            if (tag === changedTag) {
              // This is the updated tag, so we toggle it.
              tags[type][tag].display = !tags[type][tag].display;
            } else {
              // This is not the updated tag, so we set it to false.
              tags[type][tag].display = false;
            }
          });
        } else {
          // Copy the state over from the previous state.
          tags[key] = Object.assign({}, prevState.tags[key]);
        }
      });

      // No dropdown-logic, just directly toggle the tag.
      if (!switchMode) {
        tags[type][changedTag].display = !tags[type][changedTag].display;
      }

      return {
        tags: tags,
      };
    });
  }

  handleFilterChange(event: React.FormEvent<HTMLInputElement>) {
    if (event.target) {
      this.setState({
        filterText: event.currentTarget.value,
      });
    }
  }

  // Reset all buttons to their initial state.
  handleReset() {
    this.setState({
      // Not creating a clone here will cause the reset button to only work once.
      tags: JSON.parse(this.defaultTags),
    });
  }

  render() {
    return (
      <section id="career">
        <Router history={history}>
          <Switch>
            <Route
              //exact //this broke routing tot he career view when output.publicPath = '/' was added to webpack.config.js.
              //pubicPath is needed to be able to serve static correctly with with HTML webpack plugin. 
              path="/"
              render={props => <FilterableJobList
                tags={this.state.tags}
                filterText={this.state.filterText}
                jobs={this.state.jobs}
                handleReset={() => this.handleReset()}
                handleTagChange={(type: TagType, changedTag: string, switchMode: boolean) =>
                  this.handleTagChange(type, changedTag, switchMode)}
                handleFilterChange={(e: React.FormEvent<HTMLInputElement>) => this.handleFilterChange(e)}
                {...props}
              />}
            />

            <Route
              path="/:id"
              render={props => <DetailView {...props} jobs={this.state.jobs} />}
            />
          </Switch>
        </Router>
      </section>
    );
  }
}

export default Career;