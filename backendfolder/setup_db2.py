import mysql.connector

conn = mysql.connector.connect(
    host='127.0.0.1',
    port=3306,
    user='root',
    password='varun@12345'
)
cur = conn.cursor()

cur.execute('CREATE DATABASE IF NOT EXISTS cyperx_db2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
print("Database cyperx_db2 created (or already exists).")

conn.database = 'cyperx_db2'

cur.execute('''
    CREATE TABLE IF NOT EXISTS registrations (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        reg_id          VARCHAR(20)  UNIQUE NOT NULL,
        fullname        VARCHAR(100) NOT NULL,
        email           VARCHAR(100) NOT NULL,
        phone           VARCHAR(15)  NOT NULL,
        yearofstudy     INT,
        department      VARCHAR(50),
        college         VARCHAR(100),
        gender          VARCHAR(10),
        events          TEXT,
        arrivaltime     VARCHAR(10),
        regdate         VARCHAR(20),
        experience      INT DEFAULT 5,
        badgecolor      VARCHAR(10)  DEFAULT "#12b5cb",
        socialprofile   VARCHAR(255),
        specialrequests TEXT,
        payment_method  VARCHAR(30),
        accommodation   VARCHAR(5)   DEFAULT "no",
        submittedAt     VARCHAR(50)
    )
''')
print("Table 'registrations' ready.")

cur.execute('''
    CREATE TABLE IF NOT EXISTS contact_messages (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(100),
        email       VARCHAR(100),
        subject     VARCHAR(255),
        message     TEXT,
        submittedAt VARCHAR(50)
    )
''')
print("Table 'contact_messages' ready.")

conn.commit()
cur.close()
conn.close()
print("\ncyperx_db2 setup complete! All tables initialized successfully.")
