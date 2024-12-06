# How to Set Up and Use the System

Follow these steps to set up and use the system effectively:

## Prerequisites
1. **Install Node.js**  
   Ensure you have **npm version 20.11.1 or above** installed on your system.  
   You can download Node.js from [Node.js official website](https://nodejs.org/).

2. **Install XAMPP**  
   Download and install XAMPP from [Apache Friends](https://www.apachefriends.org/). After installation, **run XAMPP**.

3. **Install Postman**  
   Download and install **Postman** from [Postman official website](https://www.postman.com/).

## Steps to Set Up the System

### Step 1: Create the Database
1. Open **XAMPP Control Panel** and start the **MySQL** module.  
2. Go to `http://localhost/phpmyadmin` in your browser.  
3. Create a new database named `book_system_db`.

### Step 2: Set Up the Environment File
1. Locate the `.env.development` file in your project directory.  
2. Duplicate it and rename the duplicate file to `.env`.

### Step 3: Run Database Migrations
1. Open your terminal and navigate to your project directory.  
2. Run the following command to apply the database migrations:
   ```bash
   npm run knex migrate:latest

### Step 4: Start the Development Server

1.  Start the Development Server

```js
npm run dev
```

### Step 5: Use Postman for Testing Endpoints

1. Import Postman Collection
   1. Open Postman.
   2. Import the file named `mid-construction-test.postman_collection.json` into Postman by clicking on the **Import** button in the top-left corner of the Postman window.
   3. Select the `mid-construction-test.postman_collection.json` file and click **Open**.

### Step 6: Test the Endpoints

1. After importing the `mid-construction-test.postman_collection.json`, you can now test the API endpoints.
   The collection includes pre-configured requests that correspond to the available routes in your system.
2. Select any of the requests from the imported collection in Postman and click **Send** to test the respective API endpoint.