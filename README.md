# auris

## used googles calendar api in the /auth/calendar.readpnly and also in the clerk scopes

## used ngrok for webhooks "https://magnisonant-scoreless-terrance.ngrok-free.dev/api/webhooks/clerk"

## used svix - Webhooks as a service for connection - read docs

## Prisma schema done

# Usage Plan

## First the useeffect in the usage context will hit the fetchUsage route in that it will check for the current plan the status the meetings this month and all and then store it in the setusage hook and on the basis of that identigy is user can chat or he can make meetings and all

const meetingProgress =
usage && limits.meetings !== -1
? Math.min((usage.meetingsThisMonth / limits.meetings) \* 100, 100) //check with the total number of the meetings to be there in a month
: 0;

const chatProgress =
usage && limits.chatMessages !== -1
? Math.min((usage.chatMessagesToday / limits.chatMessages) \* 100, 100) //total number of chats that can be done in a meeting today
: 0;

## Using google calendar as well for checking if its connected or not

## taking only the first 20 events to reducd ugliness in upcoming meetings route

# Flow

## Take all the fucntions frrom the usemeeting.ts like fetchupcoming meetings pastmeetings oauth for calendar bottoggling and all and using in the home page

## Fetching the tokens for the callback of google auth

## Defining the scopes: const scope =

    "projects:read projects:write tasks:read tasks:write users:read workspaces:read";

## for asana

## Scope of jira: const scope =

    "read:jira-work write:jira-work manage:jira-project manage:jira-configuration read:jira-user offline_access";

## jira url: https://api.atlassian.com/ex/jira base URL



# 5:45 TO 6:11 Read it from erasor like what is it and all 

## USING PINECONE AS WELL

## used slacks block kit builder!!

## Storing bot avatar images in AWS images


# 6:40 to see the AWS cred