FROM node:argon 

# Create src folder for app code
RUN mkdir /src

# Copy application code into container
COPY . /src

WORKDIR /src

# Install application dependecies
RUN npm install -g truffle
RUN truffle build
RUN truffle deploy

# Expose applcation port
EXPOSE 8080

# Start the application
CMD ["truffle","serve"]
