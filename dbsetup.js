import mysql from "mysql2";
const dbConfig = {
  host: "localhost",
  user: "root",
};

const newUser = {
  username: "wpr",
  password: "fit2023",
  database: "wpr2023",
};

const databaseName = "wpr2023";

const CreateDb = async () => {
    const connection = mysql.createConnection(dbConfig);
  
    try {
      await new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            console.error("Error connecting to MySQL server:", err);
            reject(err);
            return;
          }
  
          console.log("Connected to MySQL server");
  
          const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  
          connection.query(createDatabaseQuery, (createDbErr, createDbResults) => {
            if (createDbErr) {
              console.error("Error creating database:", createDbErr);
              reject(createDbErr);
            } else {
              console.log("Database created successfully");
            }
          });
          resolve();
        });
      });
    } finally {
      connection.end();
    }
};

const createAccountInNewDb = async () => {

    const dbConfig = {
        host: "localhost",
        user: "root",
        database: "wpr2023",
      };

    const connection = mysql.createConnection(dbConfig);

    try {
        await new Promise((resolve, reject) => {
          connection.connect((err) => {
            if (err) {
              console.error("Error connecting to MySQL server:", err);
              reject(err);
              return;
            }
    
            const createUserQuery = `CREATE USER IF NOT EXISTS '${newUser.username}'@'localhost' IDENTIFIED BY '${newUser.password}'`;
        
            connection.query(createUserQuery, (createUserErr, createUserResults) => {
              if (createUserErr) {
                console.error("Error creating user:", createUserErr);
                reject(createUserErr);
                return;
              }
        
              console.log("User created successfullycc");
            });
            resolve();
          });
        });
      } finally {
        // connection.end();
      }
}

const creategrantPrivilegesQuery = async () => {

    const dbConfig = {
        host: "localhost",
        user: "root",
        database: "wpr2023",
      };

    const connection = mysql.createConnection(dbConfig);

    try {
        await new Promise((resolve, reject) => {
          connection.connect((err) => {
            if (err) {
              console.error("Error connecting to MySQL server:", err);
              reject(err);
              return;
            }
    
            const grantPrivilegesQuery = `GRANT ALL PRIVILEGES ON ${newUser.database}.* TO '${newUser.username}'@'localhost'`;
        

        
              connection.query(grantPrivilegesQuery, (grantErr, grantResults) => {
                if (grantErr) {
                  console.error("Error granting privileges:", grantErr);
                  reject(grantErr);
                } else {
                  console.log("Privileges granted successfully");
                }
              });
            resolve();
          });
        });
      } finally {
        connection.end();
      }
}
  

const name = async () => {
  const dbConfig = {
    host: "localhost",
    user: "wpr",
    password: "fit2023",
    database: "wpr2023",
    port: 3306,
  };

  // Create a connection to MySQL server
  const connection = mysql.createConnection(dbConfig);

  // Function to execute a query and log results
  const executeQuery = async (query) => {
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          console.error(`Error executing query: ${err}`);
          reject(err);
        } else {
          console.log(`Query executed successfully: ${query}`);
          resolve(results);
        }
      });
    });
  };

  // Function to create tables
  const createTables = async () => {
    // Create users table
    const createUsersTableQuery = `
          CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
          )
        `;
    await executeQuery(createUsersTableQuery);

    // Create messages table
    const createMessagesTableQuery = `
          CREATE TABLE IF NOT EXISTS mailbox (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(1000) NOT NULL,
            content VARCHAR(10000) NOT NULL,
            file VARCHAR(1000) NOT NULL,
            idSender INT NOT NULL,
            idReceiver INT NOT NULL,
            dateTime VARCHAR(1000) NOT NULL,
            readStatus TINYINT(1) DEFAULT 0
          )
        `;
    await executeQuery(createMessagesTableQuery);
  };

  // Function to insert initial data
  const insertInitialData = async () => {
    // Insert users
    const insertUsersQuery = `
          INSERT INTO user (name, email, password) VALUES
            ('Trần văn a' ,'a@a.com', '123123'),
            ('Trần văn b','user1@example.com', '123123'),
            ('Trần văn c','user2@example.com', '123123')
        `;
    await executeQuery(insertUsersQuery);
    const currentTime = new Date().getTime()
    // Insert messages
    const insertMessagesQuery = `
          INSERT INTO mailbox (title, content, file, idSender, idReceiver, dateTime) VALUES
            ('Black Friday exclusive: Save up to 50% on WordPress Plans','The biggest sale of the year!','',1, 2,'${currentTime}'),
            ('Need a hand? Our experts can help.','Our professional website-building experts can create the site of your dreams, no matter the scope of your project – from small websites and personal blogs to large-scale custom development and migrations.','',1, 3,'${currentTime}'),
            ('You have been granted Developer','WordPress.​com puts you in control of your website. We believe in providing the tools and flexibility you need to make your site look just the way you need.','',1, 3,'${currentTime}'),
            ('Need help building your WordPress website?','World-class support.The help you need. When you need it.','',1, 3,'${currentTime}'),
            ('Choose the Personal plan for excellent email customer support.','Use coupon code WPNEW.BI0O5AF at checkout before Thursday, November 30 to get 20% off your annual paid plan.','',1, 3,'${currentTime}'),
            ('13 việc làm Reactjs mới','Những quảng cáo việc làm này khớp với cảnh báo việc làm đã lưu của bạn¹','',2, 1,'${currentTime}'),
            ('Take your design to the next level','Upgrade to a Premium plan (or higher) and gain access to exclusive','',3, 1,'${currentTime}'),
            ('Your guide to Designing with Motion','Uplift your designs by introducing motion.With Lottie, you can now tell better stories & craft new design experiences.','',3, 1,'${currentTime}')
        `;
    await executeQuery(insertMessagesQuery);
  };

  // Execute the setup
  const setupDatabase = async () => {
    try {
      await connection.connect();

      console.log("Creating tables...");
      await createTables();

      console.log("Inserting initial data...");
      await insertInitialData();

      console.log("Setup completed successfully.");
    } catch (error) {
      console.error("Error during setup:", error.message);
    } finally {
      console.log("Closing connection...");
      await connection.end();
      console.log("Connection closed.");
    }
  };

  setupDatabase();
};

const Createall = async () => {
    try {
      await CreateDb();
      await createAccountInNewDb()
      await creategrantPrivilegesQuery()
      await name();
    } catch (error) {
      console.error("Error during setup:", error.message);
    }
};
  
Createall();




