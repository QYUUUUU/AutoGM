FROM node:20-alpine

RUN apk --no-cache add build-base
RUN apk add --no-cache openssl

RUN export PYTHONUNBUFFERED=1
# Replace lines 7 through 10 with this:
RUN apk add --update --no-cache python3 py3-pip \
    && ln -sf python3 /usr/bin/python