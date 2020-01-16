FROM harbor.iquantex.com/phoenix/phoenix-website:base2

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./blog /app/website
COPY ./docs /app/website
COPY ./package.json /app/website
COPY ./src /app/website
COPY ./static /app/website
COPY ./docusaurus.config.js /app/website
COPY ./README.md /app/website
COPY ./sidebars.js /app/website

CMD ["npx", "docusaurus", "start", "--host", "0.0.0.0"]
