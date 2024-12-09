
# API Documentation

To read about REST API documentation and its structure, refer to our [REST API Guide](./REST_API_Guide.pdf).


# Steps to Run the Application


### 1. Clone the Repository
Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/engr-csc-sdc/2024Fall-Team01-b-combs
```
Navigate into the project directory:

```bash
cd 2024Fall-Team01-b-combs
```

### 2. Run the Backend
To start the backend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
   Create two files: .env and "knexfile.js". <br/>
   In knexfile.js, put this code:
   ```bash
   module.exports = {
     development: {
       client: 'mysql',
       connection: {
         host: '<your-database-host>',
         user: '<your-database-username>',
         password: '<your-database-password>',
         database: '<your-database-name>'
       },
       migrations: {
         directory: './migrations'
       },
       seeds: {
         directory: './seeds'
       }
     }
   };


   ```

   In .env file, put this code:
   ```bash
   DB_HOST=<your-database-host>
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_NAME=<your-database-name>
   DB_PORT=<your-database-port>
   JWT_SECRET=<your-jwt-secret>
   PORT=<your-server-port>
   EMAIL_SERVICE=<your-email-service>
   EMAIL_USER=<your-email-address>
   EMAIL_PASS=<your-email-password>
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node index
   ```

The backend will run on [http://localhost:5001](http://localhost:5001).

### 3. Run the Frontend
To start the frontend:

1. Navigate to the frontend directory:
   ```bash
   cd frontendViteReact
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

You can access the frontend on [http://localhost:5173](http://localhost:5173).


### 4. Run the Tests

1. Navigate to the backend/__tests__ directory:
   ```bash
   cd backend/__tests__
   ```
2. Run this command:
   ```bash
   npx jest --coverage
   ```
---

