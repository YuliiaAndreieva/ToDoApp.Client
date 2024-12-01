import React from 'react';
import './App.css';
import {TaskPageComponent} from "./app/features/TaskPage/TaskPage.component";
import Header from "./app/layout/header/Header.component";
import Footer from "./app/layout/footer/Footer.component";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <div className="main">
              <Header/>
              <TaskPageComponent/>
              <Footer/>
          </div>
      </QueryClientProvider>
  );
}

export default App;
