ARG ARCH=

# pie requires ruby 2.6.6 and node 12.14.1
FROM ${ARCH}node:12.19-alpine3.12
# bash dependency
RUN apk update && apk add --no-cache bash 
# app home base
WORKDIR /usr/src/frontend


# bring environment vars
COPY ./client/.env.sample .env
COPY ./build/.env.development.local .env.development.local

# Install app dependencies
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn add http-proxy-middleware
RUN yarn 


# Bundle app source
COPY ./client ./

# proxy API during development
COPY ./build/setupProxy.js src/setupProxy.js


EXPOSE 3000

# Start the main process.
CMD ["yarn", "start"]
