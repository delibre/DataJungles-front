import { useState, useEffect, useCallback } from "react";
import * as React from "react";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import { Redirect, useHistory, useParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";
import { useDispatch } from "react-redux";
import { setUser } from "./../../redux/user/user-action";
import "./style.scss";

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

const formatDate = (date) => {
    const splitDate = date.split("T");
    return `${splitDate[0]} ${splitDate[1].substring(0, 5)}`;
};

const createCard = (icon, name, fileModification, username) => {
    return (
        <CardContent style={{ paddingBottom: "0", paddingTop: "10px" }}>
            <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
            >
                {icon} {name}
            </Typography>
            <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
            >
                {fileModification ? (
                    <span>
                        {formatDate(fileModification.time)}, {username}
                    </span>
                ) : null}
            </Typography>
        </CardContent>
    );
};

const addFolder = (
    folderName,
    folderPrivate,
    folderRole,
    access,
    accessToken,
    setModalOpen,
    setObjects,
    setLoading,
    generateCards,
    setCards,
    rootFolderId,
    user,
    dispatch
) => {
    const body = {
        name: folderName,
        isPrivate: folderPrivate,
        groupName: folderRole,
        access,
    };

    console.log(body);

    fetchWithAuthorization(
        `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/folder/${rootFolderId}`,
        JSON.stringify(body),
        accessToken,
        "POST"
    )
        .then((res) => {
            setModalOpen(false);
            getWithAuthorization(
                `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/folder/${rootFolderId}/objects`,
                accessToken
            )
                .then((res) => {
                    setObjects(res);
                    getWithAuthorization(
                        "https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/auth/user",
                        user.accessToken
                    )
                        .then((res) => {
                            dispatch(setUser(res));
                            localStorage.setItem("user", JSON.stringify(res));
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    setLoading(false);
                    window.location.reload(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

const addFile = (
    fileName,
    dataset,
    accessToken,
    setModalOpen,
    setObjects,
    setLoading,
    generateCards,
    setCards,
    rootFolderId
) => {
    const body = {
        name: fileName,
        dataset: dataset,
    };

    fetchWithAuthorization(
        `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/folder/${rootFolderId}/add-file`,
        JSON.stringify(body),
        accessToken,
        "POST"
    )
        .then((res) => {
            console.log(res);
            setModalOpen(false);
            getWithAuthorization(
                `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/folder/${rootFolderId}/objects`,
                accessToken
            )
                .then((res) => {
                    setObjects(res);
                    setLoading(false);
                    generateCards(res, setCards);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

const Folder = (props) => {
    const { id } = useParams();
    const [isFolderModalOpen, setFolderModalOpen] = useState(false);
    const [isFileModalOpen, setFileModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [folderPrivate, setFolderPrivate] = useState(false);
    const [fileName, setFileName] = useState("");
    const [dataset, setDataset] = useState("");
    const [objects, setObjects] = useState([]);
    const [cards, setCards] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isLoading2, setLoading2] = useState(false);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [access, setAccess] = useState("read");
    const [folderRole, setFolderRole] = useState("");
    const [searchText, setSearchText] = useState("");
    const [initialDraw, setInitialDraw] = useState(true);
    const [canWrite, setCanWrite] = useState(0);

    const { user } = useSelector((state) => state);

    const history = useHistory();
    const dispatch = useDispatch();

    const generateCards = useCallback(
        (objects, setCards, searchTextNew) => {
            if (objects && objects.length !== 0) {
                const fileIcon = <FontAwesomeIcon icon={faFile} />;
                const folderIcon = <FontAwesomeIcon icon={faFolder} />;
                let { fileInFolderList, folderInFolderList } = objects;
                const cards = [];

                if (searchTextNew && searchTextNew.length > 0) {
                    folderInFolderList = folderInFolderList.filter((folder) => {
                        return folder.folder.name
                            .toLowerCase()
                            .startsWith(searchTextNew.toLowerCase());
                    });
                    fileInFolderList = fileInFolderList.filter((file) =>
                        file.file.name
                            .toLowerCase()
                            .startsWith(searchTextNew.toLowerCase())
                    );
                }

                fileInFolderList.forEach((file) => {
                    const card = (
                        <Card
                            key={file.file.id}
                            style={{
                                cursor: "pointer",
                                width: "30%",
                                height: "62px",
                                marginTop: "10px",
                                display: "block",
                                backgroundColor: "green",
                            }}
                            sx={{ minWidth: 275 }}
                            onClick={() =>
                                history.push(
                                    `/preview/${file.file.id}/${canWrite}/${id}`
                                )
                            }
                        >
                            {createCard(
                                fileIcon,
                                file.file.name,
                                file.fileModification,
                                file.username
                            )}
                        </Card>
                    );
                    cards.push(card);
                });

                folderInFolderList.forEach((folder) => {
                    const card = (
                        <Card
                            key={folder.folder.id}
                            style={{
                                cursor: "pointer",
                                width: "30%",
                                height: "62px",
                                marginTop: "10px",
                                display: "block",
                                backgroundColor: "green",
                            }}
                            sx={{ minWidth: 275 }}
                            onClick={() => history.push(`${folder.folder.id}`)}
                        >
                            {createCard(
                                folderIcon,
                                folder.folder.name,
                                folder.fileModification,
                                folder.username
                            )}
                        </Card>
                    );
                    cards.push(card);
                });

                setCards(cards);
            }
        },
        [history, canWrite, id]
    );

    useEffect(() => {
        if (!user) {
            return;
        }
        setLoading(true);
        getWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/folder/${id}/objects`,
            user.accessToken
        )
            .then((res) => {
                setObjects(res);
                setLoading(false);
                generateCards(res, setCards);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [generateCards, user, id]);

    useEffect(() => {
        if (!user) {
            return;
        }
        getWithAuthorization(
            `https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/folder/${id}/permissions`,
            user.accessToken
        )
            .then((res) => {
                setPermissions(res);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user, id]);

    useEffect(() => {
        if (!user) {
            return;
        }
        setLoading2(true);
        getWithAuthorization(
            "https://datajungles.herokuapp.com/http://datajungles-env.eba-henczmrr.us-east-1.elasticbeanstalk.com//api/v1/user/user-groups",
            user.accessToken
        )
            .then((res) => {
                let arr = res.map(function (row) {
                    return { label: row.name, id: row.id };
                });
                setRoles(arr);
                setLoading2(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user]);

    useEffect(() => {
        generateCards(objects, setCards, searchText);
    }, [searchText, objects, generateCards]);

    const toggleFolderPrivate = (event) => {
        setFolderPrivate(event.target.checked);
    };

    const handleAccessChange = (event) => {
        setAccess(event.target.value);
    };

    useEffect(() => {
        if (canWrite !== 1 && !!permissions) {
            permissions.forEach((p) => {
                user.groups.forEach((g) => {
                    if (p.group.id === g.id && p.rights === "WRITE") {
                        setCanWrite(
                            p.group.id === g.id && p.rights === "WRITE" ? 1 : 0
                        );
                    }
                });
            });
        }
    }, [canWrite, permissions, user]);

    if (!user) {
        return <Redirect to="/signin" />;
    }

    return (
        <div className="folder-wrapper">
                <TextField
                style={{ width: "50%", display: "flex", margin: "0 auto" , marginTop: "20px"}}
                id="filled-password-input"
                label="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                variant="outlined"
            />
            <div style={{ width: "100%", display: "grid" }}>
            {canWrite === 1 && (
                <div
                    style={{ width: "89.5%", marginTop: "10px", float: "right" }}
                >
                    <button
                        className="button-addfolder"
                        onClick={() => setFileModalOpen(true)}
                    >
                        Add File
                    </button>
                    <button
                        style={{ marginRight: "15px" }}
                        className="button-addfolder"
                        onClick={() => setFolderModalOpen(true)}
                    >
                        Add Folder
                    </button>
                </div>
            )}
            <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
            >
                {isLoading ? null : cards}
            </div>
            {isLoading2 ? null : (
                <Modal
                    open={isFolderModalOpen}
                    onClose={() => setFolderModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <TextField
                            style={{ width: "100%" }}
                            id="filled-password-input"
                            label="Folder Name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            variant="outlined"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={folderPrivate}
                                    onChange={toggleFolderPrivate}
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                            }
                            label="Private"
                            labelPlacement="end"
                        />
                        {!folderPrivate && (
                            <div>
                                <TextInput
                                    options={roles.map((role) => role.label)}
                                    onChange={(newGroup) =>
                                        setFolderRole(newGroup)
                                    }
                                    trigger={[""]}
                                    spacer={""}
                                    style={{
                                        resize: "none",
                                        marginTop: "9px",
                                        overflow: "auto",
                                        width: "99.5%",
                                        height: "70%",
                                        whiteSpace: "nowrap",
                                    }}
                                />
                                <FormLabel>Access</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={access}
                                    onChange={handleAccessChange}
                                >
                                    <FormControlLabel
                                        value="read"
                                        control={<Radio />}
                                        label="Read"
                                    />
                                    <FormControlLabel
                                        value="readwrite"
                                        control={<Radio />}
                                        label="Read-Write"
                                    />
                                </RadioGroup>
                            </div>
                        )}
                        <button
                            style={{ marginTop: "20px" }}
                            className="button-addfolder"
                            onClick={() =>
                                addFolder(
                                    folderName,
                                    folderPrivate,
                                    folderRole,
                                    access,
                                    user.accessToken,
                                    setFolderModalOpen,
                                    setObjects,
                                    setLoading,
                                    generateCards,
                                    setCards,
                                    id,
                                    user,
                                    dispatch
                                )
                            }
                        >
                            Add Folder
                        </button>
                    </Box>
                </Modal>
            )}
            <Modal
                open={isFileModalOpen}
                onClose={() => setFileModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{ width: "90%", height: "70%", paddingBottom: "35px" }}>
                    <TextField
                        style={{ width: "100%" }}
                        id="filled-password-input"
                        label="File Name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
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
                        value={dataset}
                        onChange={(e) => setDataset(e.target.value)}
                    />
                    <button
                        style={{ marginTop: "15px" }}
                        className="button-addfolder"
                        onClick={() =>
                            addFile(
                                fileName,
                                dataset,
                                user.accessToken,
                                setFileModalOpen,
                                setObjects,
                                setLoading,
                                generateCards,
                                setCards,
                                id
                            )
                        }
                    >
                        Add File
                    </button>
                </Box>
            </Modal>
        </div>
        </div>
    );
};

export default Folder;
