FROM node:argon

# Create src folder for app code
RUN mkdir /src
WORKDIR /src

# Copy application code into container
COPY . /src

# Install application dependecies
RUN npm install

# Expose applcation port
EXPOSE 3000

# Start the application
# Using NODEMON for dev in containers??
CMD ["npm","start"]
