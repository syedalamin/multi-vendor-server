FROM node:20

WORKDIR /src 

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./prisma
RUN npm run generate

COPY . .

 
EXPOSE 5000

CMD ["npm", "run", "dev"]

 

    # docker run -p 5000:5000 -v shop-logs://src/logs --name shop -w //src -v "//c/Project/Project/multi_vendor"://src -v //src/node_modules --rm --env-file ./.env syedalamin/trusty-shop-backend:0.0.1

    # docker run -p 5000:5000 -v shop-logs://src/logs --name shop -w //src -v "//$(pwd)"://src -v //src/node_modules --rm --env-file ./.env  syedalamin/trusty-shop-backend:0.0.1

    