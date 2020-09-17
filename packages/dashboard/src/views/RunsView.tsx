import { useApolloClient } from '@apollo/react-hooks';
import { Button } from 'bold-ui';
import React from 'react';
import { RunSummary } from '../components/run/summary';
import { useGetRunsFeedQuery } from '../generated/graphql';

type RunsViewProps = {
  match: {
    params: {
      projectId: string;
    };
  };
};

export function RunsView({
  match: {
    params: { projectId },
  },
}: RunsViewProps) {
  const apollo = useApolloClient();

  apollo.writeData({
    data: {
      navStructure: [
        {
          __typename: 'NavStructureItem',
          label: projectId,
          link: `${projectId}/runs`,
        },
      ],
    },
  });

  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      filters: [
        {
          key: 'meta.projectId',
          value: projectId,
        },
      ],
      cursor: '',
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (!data) {
    return <p>No data</p>;
  }

  const runFeed = data.runFeed;

  function loadMore() {
    return fetchMore({
      variables: {
        filters: [
          {
            key: 'meta.projectId',
            value: projectId,
          },
        ],
        cursor: runFeed.cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          runFeed: {
            __typename: prev.runFeed.__typename,
            hasMore: fetchMoreResult?.runFeed.hasMore,
            cursor: fetchMoreResult?.runFeed.cursor,
            runs: [...prev.runFeed.runs, ...fetchMoreResult?.runFeed.runs],
          },
        };
      },
    });
  }

  if (!runFeed.runs.length) {
    return <div>No runs have started on this project.</div>;
  }
  return (
    <>
      {runFeed.runs.map((run) => (
        <div key={run.runId}>
          <RunSummary run={run} />
        </div>
      ))}
      {runFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
}
