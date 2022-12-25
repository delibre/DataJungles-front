import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import {
    fetchWithAuthorization,
    getWithAuthorization,
} from "../../services/services";
import { Redirect, useHistory, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import TextInput from "react-autocomplete-input";

import "./preview.scss";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const UsersInGroupPage = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state);
    const { isLogged } = useSelector((state) => state);
    const [users, setUsers] = useState([]);
    const [usersToAdd, setUsersToAdd] = useState([]);
    const [username, setUsername] = useState("");
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (!user) {
            return;
        }
        getWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/user/all-users-for-group/${id}`,
            user.accessToken
        )
            .then((res) => {
                setUsers(res);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user, id]);

    useEffect(() => {
        if (!user) {
            return;
        }
        getWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/user/all-users-for-group-to-add/${id}`,
            user.accessToken
        )
            .then((res) => {
                let arr = res.map(function (row) {
                    return { label: row.username, id: row.id };
                });
                setUsersToAdd(arr);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user, id]);

    const rows = users
        ? users.map(({ id, username }) => {
              return {
                  id,
                  username,
              };
          })
        : [];

    const columns = [{ field: "username", headerName: "User", flex: 1 }];

    const addUser = useCallback(() => {
        const body = {
            username,
        };

        fetchWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/user/add-user-to-group/${id}`,
            JSON.stringify(body),
            user.accessToken,
            "POST"
        )
            .then((res) => {
                setAddUserModalOpen(false);
                window.location.reload(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [username, id, user.accessToken]);

    if (!isLogged || !user.roles.includes("ROLE_ADMIN")) {
        return <Redirect to="/folder/1" />;
    }

    return (
        <div className="preview" style={{padding: "30px"}}>
            <div style={{height: "40px"}} className="add-user-wrapper">
                <button
                    className="button-addfolder"
                    onClick={() => setAddUserModalOpen(true)}
                >
                    Add user
                </button>
            </div>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableColumnSelector
                hideFooterSelectedRowCount
                disableColumnMenu
                components={{
                    NoRowsOverlay: () => (
                        <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                        >
                            No data
                        </Stack>
                    ),
                }}
            />
            <Modal
                open={isAddUserModalOpen}
                onClose={() => setAddUserModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{ width: "30%", height: "30%", padding: "0 20px", paddingBottom: "25px"}}>
                    <TextInput
                        options={usersToAdd.map((user) => user.label)}
                        onChange={(newUsername) => setUsername(newUsername)}
                        trigger={[""]}
                        spacer={""}
                        style={{
                            resize: "none",
                            marginTop: "10px",
                            overflow: "auto",
                            width: "99.5%",
                            height: "70%",
                            whiteSpace: "nowrap",
                        }}
                    />
                    <button
                        style={{ marginTop: "15px" }}
                        className="button-addfolder"
                        onClick={addUser}
                    >
                        Add User
                    </button>
                </Box>
            </Modal>
        </div>
    );
};

export default UsersInGroupPage;
