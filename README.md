

# Chat App
  This application built using Node.js, Express, Socket.io, Mongoose, RESTful Web Service,React JS.
  
  ![s2](https://github.com/amishawalia/assignment-chatApp/blob/master/Screenshot%20from%202022-05-01%2021-27-21.png)

# Features
  <li>Uses Express as the application Framework.</li> 
  <li>Real-time communication between a client and a server using Socket.io.</li>
  <li>Uses MongoDB, Mongoose  for storing messages and querying data.</li>
  <li>Uses RESTful Web Service for serve different platforms</li> 
  <li>Uses React.js for UI </li>
   
# Installation

### Running Locally

Make sure you have Node.js and npm install.

  1. Clone or Download the repository 
    <pre>git clone https://github.com/amishawalia/assignment-chatApp.git
         $ cd assignment-chatApp
    </pre>  
  2. Install Dependencies
      <pre>$ cd client
      npm install
      $ cd server
      npm install
      </pre>
  3. MongoDB start for need <pre>mongod</pre>command  from a different terminal.
  
  4. Start the Application
     <pre>In server :- $node server.js
     In client :- $npm start
     </pre>
  Application runs from localhost:3000.
      
## How It Works

  A database called "real-time-app.db" named is created via code. 
  The userName, messages, group information is also kept in the table formed.
    
  User to user, As a publication broadcast or group in the room  messaging.
  User to user messaging:
   <pre> /w username messagetext</pre> the message is sent as.
      
 ## Sockets
    
   Having an active connection opened between the client and the server so client can send and receive data. This allows             real-time communication using TCP sockets. This is made possible by Socket.io.

   The client starts by connecting to the server through a socket(maybe also assigned to a specific namespace). Once connections is successful, client and server can emit and listen to events. 

## RESTful

  Using HTTP requests, we can use the respective action to trigger every of these four CRUD operations.    
    <li>POST is used to send data to a server — Create</li>
    <li>GET is used to fetch data from a server — Read</li>
    <li>PUT is used to send and update data — Update</li>
    <li>DELETE is used to delete data — Delete  </li>
    
## PPT
  To read more about the app you can visit:
  (https://docs.google.com/presentation/d/10joQOgJV7Be2ezF1SRo1ciloKdhhZBr7jdqhFVSq1WE/edit?usp=sharing)
  



