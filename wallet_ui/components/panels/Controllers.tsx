import React, {useState, useEffect} from "react";
// import type { Principal } from "@dfinity/agent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Typography, Button, Dialog, DialogContent, DialogTitle, FormControl, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { EventList } from "../routes/Dashboard";
import "../../css/Events.scss";
import { CreateCanisterDialog } from "./CreateCanister";
import { CreateWalletDialog } from "./CreateWallet";
import { CreateDialog } from "./CreateDialog";
import PlusIcon from "../icons/PlusIcon";
import { css } from "@emotion/css";
import { Principal, getWalletCanister, Wallet } from "../../canister";

const useStyles = makeStyles({
  button: {
    flexGrow: 3,
    minHeight: "35px",
    marginBottom: "10px",
    margin: "5px",
  },
});

interface Props {
  canisters?: EventList["canisters"];
}

async function getControllers() {
  return await (await getWalletCanister()).get_controllers();
}

function Controllers() {
  const [controllers, setControllers] = useState<Principal[]>([]);
  const [controllersList, setList ] = useState<object[]>([
    {
      id : 1,
      name: "",
      date_created: "",
    }
  ]);
  const classes = useStyles();
  const [editable, enableEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [controller, setController] = useState("");

  const addController = (controllerToAdd : string) => {
    let controllerPrincipal : Principal = Principal.fromText(controllerToAdd);
    return getWalletCanister()
      .then(wallet => {
        wallet.add_controller(controllerPrincipal);
      })
      .catch(e => console.error(e));
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let targetController = ev.target.value;
    setController(targetController);
    checkIdFormat(controller);
  }

  const checkIdFormat = (inputId : string) => {
    let hyphenPositions = [5, 11, 17, 23, 29, 35, 41, 47, 53, 59];
    let isLengthValid = inputId.length === 63;
    let isRightFormat = hyphenPositions.every( val => {
      return inputId[val] === '-';
    });
    return isLengthValid && isRightFormat;
  }

  const removeController = (controllerRemove: string) => {
    let controllerPrincipal : Principal = Principal.fromText(controllerRemove);
    return getWalletCanister()
      .then(wallet => {
        wallet.remove_controller(controllerPrincipal);
      })
      .then( e => {
        alert(`Principal ${controllerRemove} has been removed!`)
      })
      .catch(e => console.error(e));
  }

  useEffect(() => {
    getControllers().then(result => {
      setControllers(result);
    })
  }, [controllers])

  return (
    <Grid className="controllers">
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add a Controller to the Cycles Wallet</DialogTitle>
        <DialogContent>
          Add a Principal Id as a controller. You can now have multiple controllers.
        </DialogContent>
        <FormControl style={{margin: "10px 20px"}}>
          <TextField
              autoFocus
              margin="dense"
              id="outlined-size-normal"
              label="Principal Id"
              value={controller}
              type="text"
              style={{ margin: "8px 0 24px" }}
              helperText={checkIdFormat(controller) ? "" : "Id is not valid format"}
              fullWidth
              onChange={handleChange}
            />
        </FormControl>
        <Button onClick={() => {
          setOpen(false);
          addController(controller);
        }}
          variant="contained"
          className={classes.button}
        >
          Add Controller
        </Button>
        <Button onClick={() => setOpen(false)}
          variant="contained"
          className={classes.button}
        >
          Cancel
        </Button>
    </Dialog>
      <div id="controllersTop"style={{display: "flex", flexWrap: "wrap"}}>
        <Typography
          component="h2"
          variant="h5"
          gutterBottom
          style={{ fontWeight: "bold", display: "inline-block", marginRight: "auto", alignSelf: "center", paddingRight: "60px"}}
        >
          Members
        </Typography>
        <Button variant="contained" color="secondary"
          style={{minWidth: "85px", margin: "5px", flexGrow: 1, maxWidth: "250px"}}
          onClick={() => enableEdit(!editable)}>
          {editable ? `Save Settings` : `Manage` }
        </Button>
      </div>

      <Typography component="p" gutterBottom>
        Users that have access and charge of canisters with cycles
      </Typography>
      <List className="controllersList" dense >
        {controllers.map((controller, ind) => (
          <ListItem key={ind} className="flex row">

            <div style={{fontSize: "16px", marginRight: "2rem"}}>{ind + 1}</div>
            <ListItemText>{controller.toText()}</ListItemText>
            {editable ? (
              <IconButton edge="end" aria-label="delete"
                onClick={() => removeController(controller.toString())}
              >
                <DeleteIcon/>
              </IconButton>
            ) : null }

          </ListItem>
        ))}
      </List>
    </Grid>
  )
}

export default Controllers;