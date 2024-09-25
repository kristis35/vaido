import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { useAuth } from '../services/api/Context';
import VotingPage from '../pages/VotingPage/VotingPage';
import UserList from '../pages/UserList/UserList';
import AddGroup from '../pages/AddGroup/AddGroup';
import AddFaculty from '../pages/AddFaculty/AddFaculty';
import AddUniversity from '../pages/AddUniversity/AddUniversity';
import UniversityList from '../pages/UniversityList/UniversityList';
import FacultyList from '../pages/FacultyList/FacultyList';
import GroupList from '../pages/GroupList/GroupList';
import Logout from '../pages/Logout'


const AppRouter = () => {
  const { role } = useAuth();
 
  return (
    <Router>
      <Header /> {/* Include the Header component here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        {/* Super Administratorius Routes */}
        {role === 'super administratorius' && (
          <>
            <Route path="/addmaster" element={<AddMaster />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/adminorders" element={<AdminOrders />} />
            <Route path="/adminlist" element={<AdminList />} />
            <Route path="/editgroup" element={<EditGroup />} />
            <Route path="/votingpage" element={<VotingPage />} />
            <Route path="/editorspage" element={<EditorPage />} />
            <Route path="/uservignettes" element={<UserVignettes />} />
            <Route path="/choosedate" element={<ChooseDate />} />
            <Route path="/photographerlist" element={<PhotographerList />} />
            <Route path="/photoupload" element={<PhotoUpload />} />
            <Route path="/adduserlist" element={<AddUserList />} />
            <Route path="/addgroup" element={<AddGroup />} />
            <Route path="/addfaculty" element={<AddFaculty />} />
            <Route path="/adduniversity" element={<AddUniversity />} />
            <Route path="/universitylist" element={<UniversityList />} />
            <Route path="/facultylist" element={<FacultyList />} />
            <Route path="/grouplist" element={<GroupList />} />
          </>
        )}

        {/* Fotografas Routes */}
        {role === 'fotografas' && (
          <>
            <Route path="/photographerlist" element={<PhotographerList />} />
            <Route path="/photoupload" element={<PhotoUpload />} />
          </>
        )}

        {/* Seniunas Routes */}
        {role === 'seniunas' && (
          <Route path="/adduserlist" element={<AddUserList />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;