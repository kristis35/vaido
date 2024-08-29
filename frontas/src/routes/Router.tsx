import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/HomePage';
import AddMaster from '../pages/AddMaster/AddMaster';
import AddUserList from '../pages/AddUserList/AddUserList';
import ChooseDate from '../pages/ChooseDate/ChooseDate';
import PhotographerList from '../pages/PhotographerList/PhotographerList';
import PhotoUpload from '../pages/PhotoUpload/PhotoUpload';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addmaster" element={<AddMaster />} />
        <Route path="/adduserlist" element={<AddUserList />} />
        <Route path="/choosedate" element={<ChooseDate />} />
        <Route path="/photographerlist" element={<PhotographerList />} />
        <Route path="/upload-photos/:groupName" element={<PhotoUpload />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;