FROM harbor.iquantex.com/phoenix/phoenix-website-base:2.6.0

WORKDIR /app/website

EXPOSE 3000 35729
COPY blog /app/website/blog
COPY docs /app/website/docs
COPY src /app/website/src
COPY static /app/website/static
COPY versioned_docs /app/website/versioned_docs
COPY versioned_sidebars /app/website/versioned_sidebars
COPY docusaurus.config.js /app/website
COPY package.json /app/website
COPY sidebars.js /app/website
COPY versions.json /app/website

CMD ["npx", "docusaurus", "start", "--host", "0.0.0.0", "--port", "80"]