// ----------------------
// IMPORTS

/* NPM */

// React
import React from 'react';
import PropTypes from 'prop-types';

// GraphQL
import { graphql } from 'react-apollo';

// Listen to Redux store state
import { connect } from 'react-redux';

// Routing
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom';

// <Helmet> component for setting the page title
import Helmet from 'react-helmet';

/* Local */

// NotFound 404 handler for unknown routes
import { NotFound, Redirect } from 'kit/lib/routing';

// GraphQL queries
import allMessages from 'src/queries/all_messages.gql';
import message from 'src/queries/message.gql';

// Styles
import './styles.global.css';
import css from './styles.css';
import sass from './styles.scss';
import less from './styles.less';

// Get the ReactQL logo.  This is a local .svg file, which will be made
// available as a string relative to [root]/dist/assets/img/
import logo from './reactql-logo.svg';

// ----------------------


// Now, let's create a GraphQL-enabled component...

// ... then, let's create the component and decorate it with the `graphql`
// HOC that will automatically populate `this.props` with the query data
// once the GraphQL API request has been completed
@graphql(allMessages, {
  options: (props) => ({
    ssr: true,
    variables: {
      first: 3,
    }
  })
})
class GraphQLMessageList extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      allMessages: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }),
      ),
    }),
  }

  render() {
    const { data } = this.props;
    if (data.loading) {
      return <div>loading</div>;
    }
    return (
      <div>
        {data.allMessages.map(message => (
          <GraphQLMessage key={message.id} id={message.id} />
        ))}
      </div>
    );
  }
}

@graphql(message, {
  options: (props) => ({
    ssr: false,
    variables: {
      id: props.id
    },
  })
})
class GraphQLMessage extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      Message: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
        }),
      ),
    }),
  }

  render() {
    const { data } = this.props;
    if (data.loading) {
      return <div>loading</div>;
    }

    if (! data.Message) {
      console.log(data, data.error);
      return <div>error {this.props.id}</div>;
    }

    return (
      <div>{data.Message.id}: {data.Message.text}</div>
    );
  }
}


// Export a simple component that allows clicking on list items to change
// the route, along with a <Route> 'listener' that will conditionally display
// the <Page> component based on the route name
export default () => (
  <div>
    <Helmet
      title="ReactQL application"
      meta={[{
        name: 'description',
        content: 'ReactQL starter kit app',
      }]} />
    <GraphQLMessageList />
  </div>
);
