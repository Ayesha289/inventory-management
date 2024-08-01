'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
}

const Dashboard = () => {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [user, setUser] = useState(null);;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        updateInventory(user.uid);
      } else {
        setUser(null);
        setInventory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateInventory = async (userId) => {
    if (!userId) return;

    const userInventoryRef = collection(firestore, `users/${userId}/inventory`);
    const snapshot = query(userInventoryRef);
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });

    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!user) return;

    const userInventoryRef = doc(collection(firestore, `users/${user.uid}/inventory`), item);
    const docSnap = await getDoc(userInventoryRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(userInventoryRef, { quantity: quantity + 1 });
    } else {
      await setDoc(userInventoryRef, { quantity: 1 });
    }

    await updateInventory(user.uid);
  };

  const removeItem = async (item) => {
    if (!user) return;

    const userInventoryRef = doc(collection(firestore, `users/${user.uid}/inventory`), item);
    const docSnap = await getDoc(userInventoryRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(userInventoryRef);
      } else {
        await setDoc(userInventoryRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory(user.uid);
  };

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="99vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="white"
      padding={4}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2} mt={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box
        width="80%"
        maxWidth="800px"
        border="1px solid #ddd"
        borderRadius={2}
        boxShadow={3}
        bgcolor="white"
        mt={4}
      >
        <Box
          width="100%"
          height="100px"
          bgcolor="#1976d2"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography variant="h4" color="white" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow="auto" padding={2}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f9f9f9"
              padding={2}
              borderRadius={2}
              boxShadow={1}
            >
              <Typography variant="h6" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" color="error" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default Dashboard