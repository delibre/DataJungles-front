
import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Box from '@mui/material/Box';
import {useSelector} from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { fetchWithAuthorization, getWithAuthorization } from '../../services/services';
import { Redirect } from "react-router-dom";




const HelloPage = () => {
    return (<h1> hello page </h1>);
}

export default HelloPage;