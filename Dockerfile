FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY build .
CMD ["serve", "-p", "80", "-s", "."]
