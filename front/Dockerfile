FROM node:16 as builder
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

FROM busybox
VOLUME "/opt"
WORKDIR /app
COPY ./entrypoint.sh .
COPY --from=builder /app/build /app/
CMD [ "sh", "entrypoint.sh" ]