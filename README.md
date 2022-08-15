# AWS-SA Summary

## bff-private 
1. it is the frontend for backend service
2. `winston` will help to archive the log files every half a year
3. `UserDao` is an example of how to connect to the AWS RDS
4. start with `pm2` which will monitor the nodejs process and auto restart when the process accidentally broke
5. `__test__` directory is the example of how to use the `jest` to write test cases


## server-side-rendering (micro FE)
1. contain three different frontend micro services(storybook, webiste1, website2)
2. use wepback5 module federation to set up whole resource remote connections

## nginx
1. the nginx router proxy to dispatch different url traffic to the relative FE micro services.

## ec2-cdk
1. deploy each FE mirco service as AWS ECS (server-side-rendering)
2. deploy BFF as AWS ECS (support for AJAX call, MS FE data communication)
3. the FE traffic entrypoint is the nginx which will dispatch the traffic into different MS
