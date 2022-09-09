#!/bin/bash
cd /home/ec2-user/app/src
pm2 start npm --name PickleBallWebContent -- start
pm2 startup
pm2 save
pm2 restart all