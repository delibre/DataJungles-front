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

import "./preview.scss";

const AdminPage = () => {
    const { user } = useSelector((state) => state);
    const { isLogged } = useSelector((state) => state);
    const [groups, setGroups] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (!user) {
            return;
        }
        getWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/user/all-groups`,
            user.accessToken
        )
            .then((res) => {
                setGroups(res);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user]);

    const rows = groups
        ? groups.map(({ id, name }) => {
              return {
                  id,
                  name,
              };
          })
        : [];

    const columns = [{ field: "name", headerName: "Group", flex: 1 }];

    if (!isLogged || !user.roles.includes("ROLE_ADMIN")) {
        return <Redirect to="/folder/1" />;
    }

    return (
        <div className="preview" style={{padding: "20px"}}>
            <DataGrid
                onRowClick={(rowData) => {
                    history.push(`groups/${rowData.row.id}`);
                }}
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
        </div>
    );
};

export default AdminPage;
