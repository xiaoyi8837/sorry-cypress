import React from 'react';
import { Heading, useCss, Alert, HFlow } from 'bold-ui';
import { Paper, TestState } from '../common';
import { InstanceTest, InstanceScreeshot } from '../../generated/graphql';

type TestDetailsProps = {
  test: InstanceTest;
  screenshots: InstanceScreeshot[];
};
export function TestDetails({
  test,
  screenshots,
}: TestDetailsProps): React.ReactNode {
  const screenshot = screenshots.filter((s) => s.testId === test.testId);
  const { css } = useCss();
  const title = test.title.join(' > ');

  return (
    <>
      <HFlow>
        <TestState state={test.state} />
        <Heading level={1}>{title}</Heading>
      </HFlow>
      {
        test.attempts.map((attempt,index)=>{
          return (
            <>
              <ul>
                <li>
                  <span>序号:</span> {index}
                  <br></br>
                  <span>耗时:</span> {attempt.wallClockDuration} 毫秒
                </li>
              </ul>
              {attempt.error && (
                <>
                <Alert
                    type="danger"
                    style={{
                    whiteSpace: 'pre-wrap',
                    padding: 12
                  }}
                >
                <strong>{attempt.error.message}</strong>
                </Alert>
                <Alert
                    type="danger"
                    style={{
                    whiteSpace: 'pre-wrap',
                    padding: 12,
                  }}
                >
                {attempt.error.stack && <div>{attempt.error.stack}</div>}
                </Alert>
                </>
              )}
              {screenshot.length !=0 && screenshot.map(s => {
                      if (s.testAttemptIndex === index){
                        return (
                          <>
                            <Paper>
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={s.screenshotURL}
                                  >
                                    <img
                                      className={css`
                                        {
                                          max-width: 100%;
                                        }
                                      `}
                                      src={s.screenshotURL}
                                    />
                                  </a>
                                </Paper>
                          </>
                        )
                      }
                    })
              }
            </>
          )
        })
      }
    </>
  );
}
