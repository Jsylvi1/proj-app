
import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CalendarComponent from './Components/CalendarComponent';
import Login from './Pages/Login';
import MenuBar from './Components/Menubar';
import EventPage from './Pages/EventPage';
import ProtectedRoute from './Components/ProtectedRoute';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className='scheduler-container'>
          <MenuBar />
          <Routes>
          <Route path="/" element={
                    <ProtectedRoute>
                        <CalendarComponent />
                    </ProtectedRoute>} /> 
            <Route path='/Login' element={<Login />} />
            <Route path='/events/:eventId' element={<EventPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
