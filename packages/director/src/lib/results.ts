import { InstanceResult } from '@src/types';
import { deepTraverseKeys } from './lang';
export const isInstanceFailed = (results: InstanceResult) =>
  results.stats.failures > 0;

  export const getSanitizedMongoObject = (target: object) => 
  deepTraverseKeys(target, (key: string) =>
    key.replace('$', '_').replace('.', '_')
  );

export const computingTestDuration = (target: any) => {
  if (target && target.tests){
      target.tests.forEach((test: { attempts: { wallClockDuration: number; }[]; duration: number; })=>{
      let duration = 0
        if (test.attempts){
          test.attempts.forEach((attempt: { wallClockDuration: number; })=>{
            if (attempt.wallClockDuration){
              duration = duration + attempt.wallClockDuration
            }
          })
        }
      test.duration = duration
      })
  }
}