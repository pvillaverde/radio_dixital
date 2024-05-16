FROM denoland/deno:alpine-1.42.4
LABEL MAINTAINER="Pablo Villaverde <https://github.com/pvillaverde>"

# build app directory and cache dependencies
WORKDIR /opt/radio_dixital
#COPY ./src/deps.ts /opt/radio_dixital/src/
#COPY ./deno.json /opt/radio_dixital/
#RUN deno cache ./src/deps.ts
## Now we copy our App source code, having the dependencies previously cached if possible.
ADD . /opt/radio_dixital/
RUN deno cache ./src/main.ts
RUN deno cache ./src/tasks/**
#ENTRYPOINT /opt/radio_dixital/entrypoint.sh
