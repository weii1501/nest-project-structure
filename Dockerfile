# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Use a smaller Node.js runtime as a parent image for production
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the built files and the node_modules from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

# Expose the port that the application will run on
EXPOSE 3000

# Start the application using the built files
CMD ["node", "dist/app.js"]
