import AppBar from '@mui/material/AppBar'
import {Toolbar, Badge, IconButton, Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect} from 'react'
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartSharp"
import { useDispatch, useSelector } from 'react-redux'
import { getItemCount } from '../utils'
import {styled, alpha} from "@mui/material/styles"
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { fetchAllCategories } from '../feature/categories-slice'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import SearchIcon from "@mui/icons-material/Search"
import {useAuth} from "../firebase/Auth"
import Menu from '@mui/material/Menu';

const Search = styled("section")(({theme}) => ({
    position:"relative",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover" :{
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width:"100%"
}));

const StyleAutocomplete = styled(Autocomplete) (({theme}) => ({
    color:"inherit",
    width:"100%",
    "& .MuiTextField-root":{
        paddingRight:`calc(1em + ${theme.spacing(4)})`
    },
    "& .MuiInputBase-input" :{
        color: theme.palette.common.white,
    },
    "& .MuiOutlinedInput-notchedOutline":{
        border:"none",
    },
    "& .MuiSvgIcon-root":{
        fill: theme.palette.common.white,
    }
}))

const SearchIconWrapper = styled("section")(({theme}) => ({
    padding: theme.spacing(0,2),
    height:"100%",
    position: "absolute",
    right: 0,
    pointerEvents: "none",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
}))

const StyledLink = styled(Link)(({theme}) => ({
    color: theme.palette.white,
    textDecoration:"none"
}))

function SearchBar(){
    const theme = useTheme();
    const products = useSelector(state => state.products?.value);
    const categories = useSelector(state => state.categories?.value);
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchParams] = useSearchParams()
    const category = searchParams.get("category");
    const navigate = useNavigate();
    
    useEffect(() => {
        setSelectedCategory(category ? category : "all");
    }, [category])
    
    if(!categories.length){
        dispatch(fetchAllCategories());
    }
    function handleCategoryChange(event){
        const {value} = event.target;
        navigate(value === "all" ? "/":`/?category=${value}`);
    }
    function handleSearchChange(searchTerm){
        if(searchTerm){
            navigate(
                selectedCategory === "all" 
                ? `?searchterm=${searchTerm}`
                :`/?category=${selectedCategory}&searchterm=${searchTerm}`
            );
        } else {
            navigate(
                selectedCategory === "all" 
                ? `/`
                : `/?category=${selectedCategory}`
            );
        }
    }
    return (
        <Search>
        <Select 
        value={selectedCategory}
        size="small" 
        sx={{
            m:1,
            textTransform: "capitalize",
            "&":{
                "::before":{
                    ":hover":{
                        border:"none",
                    },
                },
                "::before, &::after":{
                    border:"none",
                },
                ".MuiSelect-standard":{
                    color:"common.white",
                },
                ".MuiSelect-icon":{
                    fill: theme.palette.common.white,
                },
            },
        }} 
        variant="standard"
        labelId="selected-category"
        id="selected-category-id"
        onChange={handleCategoryChange}
        >
            <MenuItem 
            sx={{textTransform: "capitalize",}}
            value="all">all</MenuItem>
            {categories?.map((category) => (
            <MenuItem
             key={category}
             value={category}
             sx={{
                textTransform: "capitalize",
             }}>
            {category}
            </MenuItem>
            ))}
        </Select>
        <StyleAutocomplete
            freeSolo
            id="selected-product"
            onChange={(e,value)=>{
                handleSearchChange(value?.label);
            }}
            disablePortal
            options={Array.from( selectedCategory === "all"? products : products.filter((prod) => prod.category===selectedCategory), 
            (prod) => ({id:prod.id, label:prod.title})
            )}
            renderInput={(params) => <TextField {...params} />}
        />
        <SearchIconWrapper>
            <SearchIcon/>
        </SearchIconWrapper>
    </Search>
    )
}

export default function Header() {
    const {user, signOut} = useAuth();
    const cartItems = useSelector(state => state.cart?.value);
    const count = getItemCount(cartItems);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    function navigateToCart(){
        navigate("/cart");
    } 
    function handleProfileMenuOpen(e){
        setAnchorEl(e.current.Target);
    }
    function handleMenuClose(){
        setAnchorEl(null);
    }
    async function logout (){
        await signOut();
        navigate("/login");
    }
    const renderMenu = (
        <Menu 
          anchorEl={anchorEl}
          id="user-profile-menu"
          keepMounted
          tranformOrigin={{
            horizontal:"right",
            vertical:"top",
          }}
          anchorOrigin={{
            horizontal:"right",
            vertical:"bottom",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
          >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
    )

  return (
    <>
    <AppBar
     position="sticky"
     sx={{
        py:1,
     }}>
        <Toolbar sx={{display: "flex", gap:2}}>
            <Typography variant="h6" color="inherit">
                <StyledLink to="/">
                    Ecomm
                </StyledLink>
            </Typography>
            <SearchBar/>
            <Box flexBasis={500} sx={{display:{xs:"none", md:"flex"}}}>
                <IconButton onClick={navigateToCart} size="large" aria-label="">
                    <Badge badgeContent={count} color="error">
                        <ShoppingCartIcon/>
                    </Badge>
                </IconButton>
                {user? (
                    <Button onClick={handleProfileMenuOpen} color="inherit">Hello, {user?.displayName ?? user.email}</Button> 
                    ) : ( 
                        <Button color="inherit">Login</Button>
                    )}
            </Box>
        </Toolbar>
    </AppBar>
    {renderMenu}
    </>
  )
}
