import { MemoryRouter as Router, Routes, Route,RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './router';


export default function App() {
  return (
    <RouterProvider router={router}/>
  );
}
