FROM node:16.13.0
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "npm", "run", "start" ]