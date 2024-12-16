import { useState } from 'react';
import './App.css';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children, onClick}) {
  return (
    <button className='button' onClick={onClick}>{children}</button>
  );
 }

export default function App() {

  const [friends, setFriends ] = useState(initialFriends);
  const [showAddFriend, setShowFriend] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleAddFriend({friend}){
    setFriends((friends) =>[...friends, friend] );
    setShowFriend(false);
  }

  function handleShowAddFriend() {
    setShowFriend((show)=> !show);
  }

  function handleSelection(friend) {
  setSelectFriend((current)=>
    current?.id  === friend.id ?  null : friend );
   handleShowAddFriend(false);
  }

  function handleSplitBill(value){
  
    setFriends((friends) => friends.map(friend => 
      friend.id === selectFriend.id ? 
      {...friend, balance: friend.balance+value} : friend))
  
      setSelectFriend(null);

  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList friends={friends} selectFriend={selectFriend} onSelection={handleSelection} />

        { showAddFriend && 
        <FormAddFriend onAddFriend={handleAddFriend} /> }
        
        <Button  onClick={handleShowAddFriend}>
          {showAddFriend ? "Close":"Add Friend"}
        </Button>
      </div>
      { selectFriend && 
      <FormSplitBill selectFriend={selectFriend} 
                     onSplitBill={handleSplitBill}
                     key={selectFriend.id} />}
    </div>
    
  );
}

 function FriendList({ friends, onSelection, selectFriend }) {

  return(
    <div>
      <ul>
      {friends.map(
        (friend) => (
         <Friend friend={friend} 
                key={friend.id} 
                selectFriend={selectFriend}
                onSelection={onSelection} />
        ))}
      </ul>
    </div>
  );
 }

 function Friend({ friend, onSelection, selectFriend }) {
 
  const isSelected = selectFriend?.id === friend.id;

  return (
    <li className={isSelected ? 'selected': ''}>
      
       <img src={friend.image} alt={friend.name} />
      
       <h3>{friend.name}</h3>
       {friend.balance < 0 && 
      
      <p className='red'>You owe {friend.name} {Math.abs(friend.balance)}</p>}
       {friend.balance > 0 && 
      
      <p className='green'>{friend.name} owens you {Math.abs(friend.balance)}</p>}
       {friend.balance === 0 && 
      
      <p>You owe {friend.name} are even</p>}
        
        <Button onClick={()=>{onSelection(friend)}}>{isSelected ? 'Close': 'Select'}</Button>
       </li>
    );
 }

 function FormAddFriend({onAddFriend}){

  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  
  function handleSubmit(e){
    e.preventDefault();
    
    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend ={
      name, 
      image: `${image}?=${id}`,
      balance:0,
      id: id,
    };
    setName('');
    setImage("https://i.pravatar.cc/48");
  }

  return(
    <form className='form-add-firend' onSubmit={handleSubmit}>
      <label>FriendName</label>
      <input type='text' value={name} onChange={(e)=>
        setName(e.target.value)} 
      />
    
      <label>Image Url</label>
      <input type='text' value={image} onChange={(e)=>{
        setImage(e.target.value);
      }} 
      />

     <Button>Add</Button>
    </form>
  );
 }

 function FormSplitBill({ selectFriend, onSplitBill }){

  const [bill, setBill] = useState("");
  const [paydByUser, SetPayByUser] = useState('');
  const paidByFriend = bill ?  bill - paydByUser : "";
  const [WhoIsPaying, setWhoIsPaying] = useState('user');

  function handleSubmit(e){
   e.preventDefault(); 

   if (!bill || !paydByUser) return;

   onSplitBill(WhoIsPaying === 'user' ? paidByFriend : -paydByUser);
  }

  return(
    <form className='form-split-bill' onSubmit={handleSubmit} >
      
      <h2>Split a Bill with Friend {selectFriend.name}</h2>
     
      <label> Bill Value </label>
      <input type='text' 
             value={bill}
            onChange={(e) => setBill(Number(e.target.value))  }
            />

      <label> Your expense </label>
      <input type='text' value={paydByUser}
               onChange={(e) => 
               SetPayByUser(Number(e.target.value) >
                                   bill ? paydByUser: Number(e.target.value))} />

      <label> {selectFriend.name}'s expense </label>
      <input type='text' disabled  value={paidByFriend}/>
      
     <label> Who is paying the bill?</label>
      <select value={WhoIsPaying}
               onChange={(e) => 
               setWhoIsPaying(e.target.value)}>
     
        <option value='user'>You </option>
        <option value='friend'>{selectFriend.name}' Friend </option>
      </select>
    
     <Button>Split Bill</Button>
    </form>
  );
 }
