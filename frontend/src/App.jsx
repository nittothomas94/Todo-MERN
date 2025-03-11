import Input from './components/Input/input';
import Button from './components/Button/button';
import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/sidebar';
import axios from 'axios';
import DeleteModal from './components/Delete Modal/deleteModal';
import EditModal from './components/Edit Modal/editModal';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [data, setData] = useState('');
  const [delModal, setDelModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [changeText, setChangeText] = useState();
  const [id, setId] = useState();
  const [activeRow, setActiveRow] = useState('home'); // Default active row
  const currentDate = moment().format('dddd, D MMMM YYYY');
  const [hideStars, setHideStars] = useState(false); // State to control star visibility

  useEffect(() => {
    gettodos();
  }, []);

  const onchange = e => {
    setData(e.target.value);
  };

  const onAddclick = async () => {
    const response = await axios.post('http://localhost:3000/api/addtodo', {
      title: data,
    });
    setTodos([...todos, response.data.data]);
    setData('');
    const audio = new Audio('/sound/notificationTone.mp3');
    audio.play();
    toast.success('added successfully');
  };

  // gettodos
  const gettodos = async () => {
    const response = await axios.get(
      'http://localhost:3000/api/showtodo?sortorder=asc' // Use 'asc' for oldest first, 'desc' for newest first
    );
    // console.log(response.data);
    setTodos(response.data);
  };

  const onDeleteClick01 = id => {
    setDelModal(true);
    setId(id);
    console.log('dele cli');
  };

  const onCancelClick = () => {
    setDelModal(false);
    setEditModal(false);
  };

  const onDeleteClick02 = async id => {
    try {
      const response = await axios.delete(
        'http://localhost:3000/api/deletetodo/' + id
      );
      if (response.status === 200) {
        const filteredData = todos.filter(todo => todo._id !== id);
        setTodos(filteredData);
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
    setDelModal(false);
  };

  const onEditClick = id => {
    setEditModal(true);
    setId(id);
  };

  const onChangeText = e => {
    setChangeText(e.target.value);
  };

  const onModalEditClick = async () => {
    console.log('called');
    console.log(id);
    try {
      const response = await axios.patch(
        'http://localhost:3000/api/edittodo/' + id,
        { title: changeText } // Include the updated text in the request body
      );
      if (response.status === 200) {
        const updatedTodos = await axios.get(
          'http://localhost:3000/api/showtodo'
        );
        setTodos(updatedTodos.data);
      }
    } catch (err) {
      console.log(err.message);
      console.log('Error updating todo:');
    }
    setEditModal(false);
  };

  //Star Click
  const onStarClick = async (id, currentPriority) => {
    try {
      const response = await axios.patch(
        'http://localhost:3000/api/edittodo/' + id,
        { priority: !currentPriority } // Toggle priority based on current state
      );
      if (response.status === 200) {
        const updatedTodos = await axios.get(
          'http://localhost:3000/api/showtodo'
        );
        setTodos(updatedTodos.data);
      }
    } catch (err) {
      console.log('Error updating todo:', err.message);
    }
  };

  const handleRowClick = row => {
    setActiveRow(row);
  };

  //Home Click
  const onHomeClick = async () => {
    gettodos();
    handleRowClick('home');
    setHideStars(false); // Show stars when going back to home view
  };

  const onImpClick = async () => {
    const response = await axios.get(
      'http://localhost:3000/api/showtodo?sortby=priority&sortorder=desc'
    );
    setTodos(response.data);
    handleRowClick('important');
    setHideStars(true); // Hide stars when sorting by important
  };

  const onFilterClick = async () => {
    const response = await axios.get(
      'http://localhost:3000/api/showtodo?priority=true&sortby=createdAt&sortorder=desc'
    );
    setTodos(response.data);
    handleRowClick('filter');
    setHideStars(true); // Hide stars when sorting by important
  };

  const onKeyPress = e => {
    if (e.key == 'Enter') {
      onAddclick();
    }
  };

  return (
    <div className="home">
      <Sidebar
        onImpClick={onImpClick}
        onFilterClick={onFilterClick}
        onHomeClick={onHomeClick}
        activeRow={activeRow}
      />
      <DeleteModal
        show={delModal}
        onCancelClick={onCancelClick}
        onDeleteClick02={() => {
          onDeleteClick02(id);
        }}
      />

      <EditModal
        show={editModal}
        onCancelClick={onCancelClick}
        onChangeText={onChangeText}
        onEditClick={onModalEditClick}
      />

      <ToastContainer />

      <div className="right-side">
        <div className="head">
          <h1 className="heading">TO DO</h1>
          <h3>{currentDate}</h3>
        </div>

        <div className="body">
          {todos.map((item, index) => {
            return (
              <div className="card" key={index}>
                <div className="card-text">{item.title}</div>
                <div className="card-actions">
                  <button onClick={() => onDeleteClick01(item._id)}>
                    Delete
                  </button>
                  <button onClick={() => onEditClick(item._id)}>Edit</button>
                  {!hideStars && ( // Render star icon only if hideStars is false
                    <button
                      onClick={() => onStarClick(item._id, item.priority)}
                    >
                      <i
                        className={`fa-star ${
                          item.priority ? 'fa-solid' : 'fa-regular'
                        }`}
                      ></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="user-input-field">
          <Input
            type="text"
            onchange={onchange}
            value={data}
            onKeyPress={onKeyPress}
          />
          <Button classname="add" text="Add" onclick={onAddclick} />
        </div>
      </div>
    </div>
  );
};

export default App;
