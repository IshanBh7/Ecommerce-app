import  Container  from '@mui/material/Container'
import  Grid  from '@mui/material/Grid'
import  Typography  from '@mui/material/Typography'
import  Card  from '@mui/material/Card'
import  Box  from '@mui/material/Box'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CardContent, CardMedia, TextField, Rating, Button } from '@mui/material'
import { useTheme } from '@emotion/react'
import { getSubTotal } from '../utils'
import { addToCart, removeFromCart } from '../feature/cart-slice'
import { useNavigate } from 'react-router-dom'
 
 export default function Cart() {

   const cart = useSelector((state) => state.cart?.value);
   const subtotal = getSubTotal(cart).toFixed(2);
   const theme = useTheme();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   function updateQuantity(e, {product, quantity}){
      const updatedQuantity = e.target.valueAsNumber;
      if(updatedQuantity < quantity){
          dispatch(removeFromCart({product}))
      } else {
          dispatch(addToCart({product}));
      }
   }

   function goToHome(){
      navigate("/");
   }
   function checkoutItems(){
      navigate("/checkout");
   }

   return (
    <Container sx={{ py:8}}>
      <Grid container spacing={2}>
        <Grid item container spacing={2} md={8}>
          {cart?.map(({product, quantity}) => {
              const {title, id, price, description, rating, image} = product;
              return (
              <Grid item key={id} xs={12}>
                <Card sx={{
                  display:"flex",
                  py: 2,
                }}>
                  <CardMedia component="img" image={image} sx={{
                    width:theme.spacing(30),
                    height:theme.spacing(30),
                    objectFit:"contain",
                    pt:theme.spacing()
                  }}
                    alt={title}
                  />
                  <CardContent sx={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    flex:1,
                  }}>
                    <Box sx={{display:"flex", flexDirection:"column", gap:2}}> 
                      <Typography variant="h5">{title}</Typography>
                      <Rating readOnly precision={0.5} value={rating.rate}/>                    
                      <form>
                        <TextField sx={{
                          width:theme.spacing(8),
                        }}
                        inputProps={{
                          min:0,
                          max:10,
                        }}
                        id= {`${id}-product-id`} 
                        type="number"
                        variant="standard"
                        label="Quantity" 
                        value={quantity}
                        onChange={(e) => updateQuantity(e, {product, quantity})}
                        ></TextField>
                      </form>
                    </Box>
                    <Box>
                      <Typography variant="h5" paragraph>
                        {getSubTotal([{product, quantity}]).toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>);
          })}
        </Grid>
        <Grid item md={4} sx={{
          display:"flex",
          justifyContent:"center",
        }}>
        <Box sx={{
          width:"100%",
        }}>
        <Card sx={{
          padding:2,
          display:"flex",
          flexDirection:"column",
          gap:2,
        }}>
          <Typography variant="h4">Subtotal</Typography>
          <Typography variant="h4">{subtotal}</Typography>
          {subtotal>0 ? <Button variant="contained" onClick={checkoutItems}>Buy Now</Button> : <Button variant="contained" onClick={goToHome}>Shop Products</Button>} 
        </Card>
        </Box>
        </Grid>
      </Grid>
    </Container>
   );
 }