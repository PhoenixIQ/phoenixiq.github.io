FROM harbor.iquantex.com/phoenix/phoenix-website:website

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./blog /app/website/blog
COPY ./docs /app/website/docs
COPY ./package.json /app/website
COPY ./src /app/website/src
COPY ./static /app/website/static
COPY ./docusaurus.config.js /app/website
COPY ./README.md /app/website
COPY ./sidebars.js /app/website

CMD ["npx", "docusaurus", "start", "--host", "0.0.0.0"]
