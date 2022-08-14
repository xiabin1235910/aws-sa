FROM nginx

# Create app directory
WORKDIR /home/docker/code/

# install our code
COPY . .

# Configure Nginx
RUN ln -s /home/docker/code/nginx-app.conf /etc/nginx/conf.d/
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.ORIGINAL

EXPOSE 80 
CMD ./start.sh

