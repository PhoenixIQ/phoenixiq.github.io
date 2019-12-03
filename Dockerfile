FROM harbor.iquantex.com/phoenix/phoenix-website:base

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./docs /app/docs
COPY ./website /app/website

CMD ["npm", "start"]
