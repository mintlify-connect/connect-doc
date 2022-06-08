import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import { useLocation } from "react-router-dom";

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

import './Chat.css';

let socket;


const Chat = () => {
   const location = useLocation();

   const [name, setName] = useState('');
  
   
   useEffect(() => {
       const {name, room} = queryString.parse(location.search);

       socket = io(ENDPOINT);

       setName(name);
       setRoom(room);

       socket.emit('join', {name, room}, () => {           
       });

       return () => {
           socket.emit('disconnect');
           socket.off();
       }
   }, [ENDPOINT, location.search]);
 
   useEffect(() => {
       socket.on('message', (message) => {
        setMessages([...messages, message]);
       })
   }, [messages]);

   const sendMessage = (event) => {
       event.preventDefault();
       if(message) {
           socket.emit('sendMessage', message, () => setMessage(''));
       }
   }

   return (
     <div className="outerContainer">
       <div className="container">
         <InfoBar room={room} />
         <Messages messages={messages} name={name} />
         <Input
           message={message}
           setMessage={setMessage}
           sendMessage={sendMessage}
         />
       </div>
     </div>
   );
}

export default Chat;