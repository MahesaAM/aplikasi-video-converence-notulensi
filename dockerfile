FROM node:16.15.0

COPY server.js /app/server.js

CMD ["node","server.js"]

