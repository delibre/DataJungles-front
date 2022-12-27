import "./preview-page.scss";

import { useState, useEffect, useCallback } from "react";
import {
    getWithAuthorization,
    fetchWithAuthorization,
} from "../../services/services";
import { useSelector, useDispatch } from "react-redux";

import { v4 as uuidv4 } from "uuid";
import { Redirect, useHistory, useParams } from "react-router-dom";

import Preview from "../../components/preview/preview";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";

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

const updateFile = (
    dataset,
    accessToken,
    setModalOpen,
    id,
    canWrite,
    history
) => {
    const body = {
        dataset: dataset,
    };

    fetchWithAuthorization(
        `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/dataset/${id}/update`,
        JSON.stringify(body),
        accessToken,
        "PUT"
    )
        .then((res) => {
            console.log(res);
            window.location.reload(false);
        })
        .catch((error) => {
            console.log(error);
        });
};

const PreviewPage = (props) => {
    const { id, access, rootFolderId } = useParams();
    const { user } = useSelector((state) => state);
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [isFileModalOpen, setFileModalOpen] = useState(false);

    const [columnNames, setColumnNames] = useState([]);
    const [dataRows, setDataRows] = useState([]);
    const [file, setFile] = useState({});
    const [updatedDataset, setUpdatedDataset] = useState("");

    const deleteFile = useCallback(() => {
        fetchWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/dataset/${id}`,
            {},
            user.accessToken,
            "DELETE"
        )
            .then(() => {
                history.push(`/folder/${rootFolderId}`);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [history, id, user.accessToken, rootFolderId])

    useEffect(() => {
        setLoading(true);

        getWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/dataset/${id}`,
            user.accessToken
        )
            .then((dataset) => {
                setFile(dataset);
                setUpdatedDataset(dataset.dataset);
                let datasetRows = dataset.dataset.split("\n");
                setColumnNames(datasetRows.shift().split(","));
                datasetRows = datasetRows.map((row) => row.split(","));
                datasetRows = datasetRows.map((row) => {
                    let rowObject = {};
                    for (let i = 0; i < row.length; i++) {
                        rowObject["id"] = uuidv4();
                        rowObject[`field${i}`] = row[i];
                    }
                    return rowObject;
                });

                datasetRows.forEach((row) => row.map);
                setDataRows(datasetRows);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id, user.accessToken]);

    const dataColumns = columnNames.map((columnName, index) => {
        return {
            field: `field${index}`,
            headerName: columnName,
            width: 150,
            headerClassName: "column-header",
            cellClassName: "row-cell",
            headerAlign: "center",
            align: "center",
        };
    });

    if (!user) {
        return <Redirect to="/signin" />;
    }

    return (
        <div className="preview-page">
            <h2 className="preview-title">{file.name}</h2>
            <div className="wrapper">
            <div className="buttons-wrapper" style={{height: "40px"}}>
              {access === "1" && (
                  <button
                      style={{marginLeft: "15px"}}
                      className="button-addfolder"
                      onClick={deleteFile}
                  >
                      Delete
                  </button>
              )}
              <button
                  className="button-addfolder"
                  onClick={() => setFileModalOpen(true)}
              >
                  {access === "1" ? "Edit" : "Raw"}
              </button>
            </div>
            <div>
                <Preview
                    dataRows={dataRows}
                    dataColumns={dataColumns}
                    pageSize={10}
                    disableColumnSelector
                    hideFooterSelectedRowCount
                    disableColumnMenu
                />
            </div>
            </div>
            <Modal
                open={isFileModalOpen}
                onClose={() => setFileModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{ width: "90%", height: "70%" }}>
                    <TextField
                        style={{ width: "100%" }}
                        id="filled-password-input"
                        label="File Name"
                        value={file.name}
                        readOnly
                        variant="outlined"
                    />
                    <TextareaAutosize
                        aria-label="empty textarea"
                        style={{
                            resize: "none",
                            marginTop: "10px",
                            overflow: "auto",
                            width: "99.5%",
                            height: "70%",
                            whiteSpace: "nowrap",
                        }}
                        value={updatedDataset}
                        onChange={(e) => {
                            setUpdatedDataset(e.target.value);
                        }}
                    />
                    {access === "1" && (
                        <button
                            style={{ marginTop: "15px" }}
                            className="button-addfolder"
                            onClick={() =>
                                updateFile(
                                    updatedDataset,
                                    user.accessToken,
                                    setFileModalOpen,
                                    id,
                                    access,
                                    history
                                )
                            }
                        >
                            Update File
                        </button>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default PreviewPage;
