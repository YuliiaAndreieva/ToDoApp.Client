import React from 'react';
import './App.css';
import {TaskPageComponent} from "./app/features/TaskPage/TaskPage.component";
import Header from "./app/layout/header/Header.component";
import Footer from "./app/layout/footer/Footer.component";

function App() {
  return (
      <div>
          <Header />
            <TaskPageComponent />
          <Footer />
      </div>
  );
}

export default App;
