FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g pm2
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN chmod 777 ./start.sh

ENV PORT=80

EXPOSE 80

CMD ./start.sh
# CMD [ "node", "server.js" ]
