import React from 'react';
import './App.css';
import Header from "./app/layout/header/Header.component";
import Footer from "./app/layout/footer/Footer.component";
import {QueryClient, QueryClientProvider} from "react-query";
import {WeekPageComponent} from "./app/features/WeekPage/WeekPage.component";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import {TaskPageComponent} from "./app/features/TaskPage/TaskPage.component";

const queryClient = new QueryClient();

function App() {
  // return (
  //     <QueryClientProvider client={queryClient}>
  //         <div className="main">
  //             <Header/>
  //             {/*<WeekPageComponent></WeekPageComponent>*/}
  //
  //             <Footer/>
  //         </div>
  //     </QueryClientProvider>
  // );
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="main">
                    <Header />
                    <Routes>
                        <Route path="/" element={<WeekPageComponent />} />
                        <Route path="/tasks" element={<TaskPageComponent />} />
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
