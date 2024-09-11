import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/HomePage';
import AddMaster from '../pages/AddMaster/AddMaster';
import AddUserList from '../pages/AddUserList/AddUserList';
import ChooseDate from '../pages/ChooseDate/ChooseDate';
import PhotographerList from '../pages/PhotographerList/PhotographerList';
import PhotoUpload from '../pages/PhotoUpload/PhotoUpload';
import Header from '../components/Header'; // Import the Header component
import EditorPage from '../pages/EditorPage/EditorPage';
import UserVignettes from '../pages/UserVignettes/UserVignettes';
import AdminOrders from '../pages/AdminOrders/AdminOrders';
import AdminList from '../pages/AdminList/AdminList';
import EditGroup from '../pages/EditGroup/EditGroup';
import VotingPage from '../pages/VotingPage/VotingPage';


const AppRouter = () => {
  return (
    <Router>
      <Header /> {/* Include the Header component here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addmaster" element={<AddMaster />} />
        <Route path="/adduserlist" element={<AddUserList />} />
        <Route path="/choosedate" element={<ChooseDate />} />
        <Route path="/photographerlist" element={<PhotographerList />} />
        <Route path="/photoupload" element={<PhotoUpload />} />
        <Route path="/editorpage" element={<EditorPage />} />
        <Route path="/uservignettes" element={<UserVignettes />} />
        <Route path="/adminorders" element={<AdminOrders />} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/edit-group/:groupName" element={<EditGroup />} />
        <Route path="/choosedate/:groupName" element={<ChooseDate />} />
        <Route path="/editgroup" element={<EditGroup />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
        <Route path="/votingpage" element={<VotingPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;