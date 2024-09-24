import React from 'react';
import RemoteApp from 'mf2/App';
import ChatBox from 'mf2/ChatBox';
import ChatView from 'mf2/ChatView';
import './App.css';

const App = (
  // destructure the store needed to render less code
    { stores: { utilityStore } }:
    { stores?: any }
) => (
<div className="content">
    <h1>Rsbuild with React</h1>
    <p>Start building amazing things with Rsbuild.</p>
    <RemoteApp />
    <ChatView />
    <ChatBox handleSend={(send: any) => {
        console.log("send Callback from host app: ", send)
    }} />
</div>
);

export default App;
