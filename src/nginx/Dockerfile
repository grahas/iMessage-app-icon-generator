# Choose NGINX as our base Docker image
FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
# RUN rm -rf *

# Entry point when Docker container has started
ENTRYPOINT ["nginx", "-g", "daemon off;"]