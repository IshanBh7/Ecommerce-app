import React, { useEffect, useState } from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import Paper from "@mui/material/Paper"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import {Link} from "react-router-dom"
import { Typography } from '@mui/material'
import AddressForm from '../Components/AddressForm'
import PaymentsForm from '../Components/PaymentsForm'
import ReviewForm from '../Components/ReviewForm'
import { useDispatch } from 'react-redux'
import { clearCheckoutInformation } from '../feature/checkout-slice'
import {clearCart} from '../feature/cart-slice'

const steps= ["Shopping Address", "Payment Details", "Review Order"];

function getStepContent(activeStep){
     switch(activeStep){
      case 0: 
        return <AddressForm/>;
      case 1: 
        return <PaymentsForm/>;
      case 2: 
        return <ReviewForm/>;
      default:
        throw new Error("Unknown step");
     }
}

export default function Checkout() {
  const [activeStep, setactiveStep] = useState(0)
  const dispatch = useDispatch();

  useEffect(()=>{
    if(activeStep === steps.length){
      dispatch(clearCart());
      dispatch(clearCheckoutInformation());
    }
  })

  function handleNext(){
    setactiveStep(activeStep+1);
  }
  function handleBack(){
    setactiveStep(activeStep-1);
  }
  
  return (
    <Container component="section" maxWidth="lg" 
      sx={{
        mb:4
      }}>
      <Paper variant='outlined' sx={{my:{xs:3, md:6}, p:{xs:2 , md:3}}}>
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper
        activeStep={activeStep}
        sx={{
          pt:3,
          pb:5,
        }}
        >
          {steps.map((label)=>(
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length? (<>
          <Typography variant="h5" gutterBottom>
            Thank you for your order
          </Typography>
          <Typography>
            Your order number is #12342.We have emailed you some details regarding some confirmation.
          </Typography>
          <Link to="/">Shop More</Link>
        </>):(<>
          {getStepContent(activeStep)}
          <Box sx={{display:"flex", justifyContent:"flex-end"}}>
            {activeStep !==0 && (
              <Button sx={{
                mt:3, ml:1,
              }} onClick={handleBack} variant='contained'>
               Back
              </Button>)}
            <Button sx={{
                mt:3, ml:1,
              }}
              onClick={handleNext} 
              variant='contained'>
              {activeStep === steps.length-1 ? "Place Order" : "Next"}
            </Button>
          </Box>
        </>)}
      </Paper>
    </Container>
  )
}
